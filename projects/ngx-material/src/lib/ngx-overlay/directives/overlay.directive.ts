import {Directive, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Subject, Subscribable, Subscription, Unsubscribable} from "rxjs";
import {OverlayManagerService} from "../services/overlay-manager.service";
import {OverlayInstance} from "../models/overlay-context.models";

@Directive({selector: '[ngxOverlay]'})
export class OverlayDirective implements OnDestroy {

  private showSub?: Unsubscribable;
  private externalShow$?: Subject<boolean>;

  private show$ = new BehaviorSubject(false);
  @Input('ngxOverlay') set show(show: boolean|Subscribable<boolean>) {
    this.showSub?.unsubscribe();
    this.externalShow$ = undefined;

    if (typeof show === 'boolean') {
      this.show$.next(show);
      this.check();
      return;
    }

    this.showSub = show.subscribe(this.show$);

    if (show instanceof Subject) {
      this.externalShow$ = show;
    }

    this.check();
  }

  private _onClose?: () => any;
  @Input('ngxOverlayClose')
  set closeMethod(onClose: (() => any)|undefined) {
    this._onClose = onClose;
    this.check();
  };

  @Output() closed = new EventEmitter<void>();

  maxWidth$ = new BehaviorSubject<number|undefined>(undefined);

  @Input('ngxOverlayMaxWidth')
  set overlayMaxWidth(width: number|undefined) {
    this.maxWidth$.next(width);
  }
  @Input('maxWidth')
  set maxWidth(width: number|undefined) {
    this.maxWidth$.next(width);
  }

  scrollable$ = new BehaviorSubject(false);

  @Input('ngxOverlayScrollable')
  set overlayScrollable(scrollable: boolean|undefined) {
    this.scrollable$.next(scrollable ?? false);
  }
  @Input('scrollable')
  set scrollable(scrollable: boolean|undefined) {
    this.scrollable$.next(scrollable ?? false);
  }

  private canClose$ = new BehaviorSubject(false);

  private sub: Subscription;
  private instance?: OverlayInstance;

  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef,
    private manager: OverlayManagerService
  ) {
    this.sub = this.show$.pipe(distinctUntilChanged()).subscribe(show => this.toggleOverlay(show))
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.showSub?.unsubscribe();
    if (this.instance) this.manager.closeOverlay(this.instance);
  }

  check() {
    this.canClose$.next(this.closed.observed || !!this._onClose || !!this.externalShow$);
  }

  private toggleOverlay(show: boolean) {

    if (show) {
      if (this.instance) return;

      this.instance = this.manager.createOverlay(
        this.viewContainer,
        this.templateRef,
        {
          maxWidth$: this.maxWidth$,
          scrollable$: this.scrollable$,
          canClose$: this.canClose$,
        }
      );

      this.instance.onClose(() => this.closeOverlay());
      return;
    }

    if (!this.instance) return;
    this.manager.closeOverlay(this.instance);
    this.instance = undefined;
  }

  private closeOverlay() {
    this._onClose?.();
    this.closed.emit();
    this.externalShow$?.next(false);
  }
}
