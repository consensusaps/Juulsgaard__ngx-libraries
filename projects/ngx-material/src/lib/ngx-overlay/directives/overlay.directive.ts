import {
  ChangeDetectorRef, Directive, DoCheck, EventEmitter, Injector, Input, OnDestroy, Output, TemplateRef, ViewContainerRef
} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Subject, Subscribable, Subscription, Unsubscribable} from "rxjs";
import {OverlayInstance, OverlayManagerService} from "../services/overlay-manager.service";
import {OverlayContext} from "../models/overlay-context.models";

@Directive({selector: '[ngxOverlay]'})
export class OverlayDirective implements OnDestroy, DoCheck {

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
  private changes$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef,
    private manager: OverlayManagerService,
    private injector: Injector,
    private changes: ChangeDetectorRef
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

      const context: OverlayContext = {
        injector: this.injector,
        onClose: () => this.closeOverlay(),
        template: this.templateRef,
        maxWidth$: this.maxWidth$,
        scrollable$: this.scrollable$,
        canClose$: this.canClose$,
        changes$: this.changes$,
        onChange: () => this.changes.detectChanges()
      };
      this.instance = this.manager.createOverlay(context);
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

  ngDoCheck() {
    this.changes$.next();
  }
}
