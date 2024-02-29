import {ChangeDetectorRef, DestroyRef, Directive, ElementRef, HostBinding, inject, ViewChild} from "@angular/core";
import {SnackbarContext} from "../models";
import {PointerEvent} from "react";
import {fromEvent, merge, Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive()
export abstract class SnackbarBaseComponent<T> {

  protected readonly changes = inject(ChangeDetectorRef);
  protected readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  protected readonly context: SnackbarContext<T> = inject(SnackbarContext<T>);
  protected readonly data = this.context.data;
  protected readonly dismissable = this.context.dismissable;
  protected readonly destroyed = inject(DestroyRef);

  private readonly _click$ = new Subject<void>();
  protected readonly click$ = this._click$.asObservable();

  protected constructor() {
    this.element.classList.add('ngx-snackbar-base');
    this.element.classList.add(...this.context.styles);

    if (this.context.swipeable) this.registerGestures();
    else this.registerClick();

    if (this.context.showTimer && this.context.duration) this.startTimer();
    else this.removeTimer();

    this.destroyed.onDestroy(() => this._click$.complete());
  }

  //<editor-fold desc="Touch gestures">
  private gestureStart?: TouchPoint;
  private elementWidth = 0;

  @HostBinding('@snackbar')
  private swipeDismissed: 'left'|'right'|'none' = 'none';

  private registerGestures() {
    fromEvent<PointerEvent<HTMLElement>>(this.element, 'pointerdown', {passive: true}).pipe(
      takeUntilDestroyed()
    ).subscribe(e => this.touchBegin(e));

    fromEvent<PointerEvent<HTMLElement>>(this.element, 'pointermove', {passive: true}).pipe(
      takeUntilDestroyed()
    ).subscribe(e => this.touchMove(e));

    merge(
      fromEvent<PointerEvent<HTMLElement>>(this.element, 'pointerleave', {passive: true}),
      fromEvent<PointerEvent<HTMLElement>>(this.element, 'pointerup', {passive: true}),
      fromEvent<PointerEvent<HTMLElement>>(this.element, 'pointercancel', {passive: true}),
    ).pipe(
      takeUntilDestroyed()
    ).subscribe(e => this.touchEnd(e));
  }

  private registerClick() {
    fromEvent<MouseEvent>(this.element, 'click').pipe(
      takeUntilDestroyed()
    ).subscribe(() => this._click$.next())
  }

  private touchBegin(event: PointerEvent<HTMLElement>) {
    if (this.swipeDismissed !== 'none') return;
    if (this.gestureStart) return;
    this.elementWidth = this.element.clientWidth;
    this.gestureStart = new TouchPoint(event);
  }

  private touchMove(event: PointerEvent<HTMLElement>) {
    if (!this.gestureStart?.match(event)) return;
    const delta = this.gestureStart.distance(event);
    this.element.style.transform = `translateX(${delta.x}px)`;
    const fraction = Math.abs(delta.x) / (this.elementWidth || 100);
    const opacity = Math.max(1 - fraction * 2, 0.2);
    this.element.style.opacity = opacity.toFixed(2);

    if (fraction > 0.5) {
      this.touchEnd(event);
    }
  }

  private touchEnd(event: PointerEvent<HTMLElement>) {
    if (!this.gestureStart) return;
    if (!this.gestureStart?.match(event)) return;
    const delta = this.gestureStart.distance(event);
    const fraction = Math.abs(delta.x) / (this.elementWidth || 100);

    const age = this.gestureStart.age();
    this.gestureStart = undefined;

    if (fraction <= 0.1) {
      this.element.style.transform = '';
      this.element.style.opacity = '';

      if (age <= 500 && event.type !== 'pointerleave') {
        this._click$.next();
      }
      return;
    }


    this.swipeDismissed = delta.x > 0 ? 'right' : 'left';
    this.changes.markForCheck();
    setTimeout(() => this.dismiss());
  }
  //</editor-fold>

  @ViewChild('timer') timerElement?: ElementRef<HTMLElement>;

  private startTimer() {
    setTimeout(() => {
      if (!this.timerElement) return;
      const delta = (Date.now() - this.context.createdAt) + 100;
      const duration = this.context.duration! - delta;
      this.timerElement.nativeElement.style.transitionDuration = `${Math.max(0, duration)}ms`;
      this.timerElement.nativeElement.style.transform = `scaleX(1)`;
    });
  }

  private removeTimer() {
    setTimeout(() => {
      if (!this.timerElement) return;
      this.timerElement.nativeElement.style.display = 'none';
    });
  }

  dismiss() {
    if (!this.dismissable) return;
    this.context.dismiss();
  }
}

class TouchPoint {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly start = Date.now();

  constructor(event: PointerEvent) {
    this.id = event.pointerId;
    this.x = event.clientX;
    this.y = event.clientY;
  }

  match(event: PointerEvent) {
    return this.id === event.pointerId;
  }

  distance(event: PointerEvent<HTMLElement>) {
    return {x: event.clientX - this.x, y: event.clientY - this.y}
  }

  age() {
    return Date.now() - this.start;
  }
}
