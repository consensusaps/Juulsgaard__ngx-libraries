import {
  booleanAttribute, Directive, EventEmitter, inject, Input, OnDestroy, Output, TemplateRef, ViewContainerRef
} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Subject, Subscribable, Unsubscribable} from "rxjs";
import {OverlayManagerService} from "../services/overlay-manager.service";

import {OverlayInstance} from "../models/overlay-instance";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NgxOverlayDefaults} from "../models/overlay-defaults";
import {map} from "rxjs/operators";
import {arrToSet, setToArr} from "@juulsgaard/ts-tools";

@Directive({selector: '[ngxOverlay]'})
export class OverlayDirective implements OnDestroy {

  private defaults = inject(NgxOverlayDefaults);

  private showSub?: Unsubscribable;
  private externalShow$?: Subject<boolean>;

  private show$ = new BehaviorSubject(false);
  @Input('ngxOverlay') set show(show: boolean|Subscribable<boolean>) {
    this.showSub?.unsubscribe();
    this.externalShow$ = undefined;

    if (typeof show === 'boolean') {
      this.show$.next(show);
      this.updateCanClose();
      return;
    }

    this.showSub = show.subscribe({
      next: x => this.show$.next(x)
    });

    if (show instanceof Subject) {
      this.externalShow$ = show;
    }

    this.updateCanClose();
  }

  private _onClose?: () => any;
  @Input('ngxOverlayClose')
  set closeMethod(onClose: (() => any)|undefined) {
    this._onClose = onClose;
    this.updateCanClose();
  };

  @Output() closed = new EventEmitter<void>();

  type$ = new BehaviorSubject<string|undefined>(undefined);

  @Input('ngxOverlayType')
  set overlayType(type: string|undefined) {
    this.type$.next(type);
  }
  @Input('type')
  set type(type: string|undefined) {
    this.type$.next(type);
  }

  styles$ = new BehaviorSubject<string[]>([]);

  @Input('ngxOverlayStyles')
  set overlayStyles(styles: string[]|string|undefined) {
    this.styles$.next(Array.isArray(styles) ? styles : styles ? [styles] : []);
  }
  @Input('styles')
  set styles(styles: string[]|string|undefined) {
    this.styles$.next(Array.isArray(styles) ? styles : styles ? [styles] : []);
  }

  scrollable$ = new BehaviorSubject<boolean|undefined>(undefined);

  @Input('ngxOverlayScrollable')
  set overlayScrollable(scrollable: boolean|undefined) {
    this.scrollable$.next(scrollable ?? false);
  }
  @Input({alias: 'scrollable', transform: booleanAttribute})
  set scrollable(scrollable: boolean) {
    this.scrollable$.next(scrollable);
  }

  private canClose$ = new BehaviorSubject(false);

  private instance?: OverlayInstance;

  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef,
    private manager: OverlayManagerService
  ) {
    this.show$.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged()
    ).subscribe(show => this.toggleOverlay(show))
  }

  ngOnDestroy() {
    this.showSub?.unsubscribe();
    if (this.instance) this.manager.closeOverlay(this.instance);
  }

  updateCanClose() {
    this.canClose$.next(this.closed.observed || !!this._onClose || !!this.externalShow$);
  }

  private toggleOverlay(show: boolean) {

    if (show) {
      if (this.instance) return;

      this.instance = this.manager.createOverlay(
        this.viewContainer,
        this.templateRef,
        {
          type$: this.type$.pipe(map(x => x ?? this.defaults.type)),
          styles$: this.styles$.pipe(map(x => setToArr(arrToSet([...x, ...this.defaults.styles])))),
          scrollable$: this.scrollable$.pipe(map(x => x ?? this.defaults.scrollable)),
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
