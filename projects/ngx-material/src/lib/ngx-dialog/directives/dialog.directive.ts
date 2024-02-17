import {
  booleanAttribute, computed, Directive, effect, EventEmitter, inject, Injector, input, model, OnDestroy, Output,
  signal, TemplateRef, ViewContainerRef
} from '@angular/core';
import {Observable, of, Subscribable, Subscription, switchMap} from "rxjs";
import {arrToSet, setToArr} from "@juulsgaard/ts-tools";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {NgxDialogDefaults} from "../models/dialog-defaults";
import {DialogManagerService} from "../services/dialog-manager.service";
import {TemplateDialogInstance} from "../models/template-dialog-context";
import {RenderSource} from "@juulsgaard/ngx-tools";


@Directive({selector: '[ngxDialog]'})
export class DialogDirective implements OnDestroy, RenderSource {

  private defaults = inject(NgxDialogDefaults);
  private injector = inject(Injector);
  private manager = inject(DialogManagerService);

  readonly template = inject(TemplateRef<{}>);
  readonly viewContainer = inject(ViewContainerRef);

  header = input<string>();
  scrollable = input(false, {transform: booleanAttribute});
  type = input<string>();
  styles = input(
    [] as string[],
    {
      transform: (styles: string[]|string|undefined) => Array.isArray(styles) ? styles : styles ? [styles] : []
    }
  );

  showIn = input.required({
    alias: 'ngxDialog',
    transform: (show: boolean | '' | Subscribable<boolean> | undefined | null) => {
      if (show === true || show === '') return of(true);
      if (show == null || show === false) return of(false);
      return new Observable<boolean>(subscriber => show.subscribe(subscriber));
    }
  });

  show = model(true);

  @Output() closed = new EventEmitter<void>();
  //TODO: Replace with `show.observed` when possible
  allowClose = input(false, {transform: booleanAttribute});
  canClose = computed(() => this.closed.observed || this.allowClose())

  private closeDialog() {
    this.closed.emit();
    if (this.allowClose()) this.show.set(false);
  }

  private instance?: TemplateDialogInstance;
  private instanceSub?: Subscription;

  constructor() {
    const show$ = toObservable(this.showIn).pipe(switchMap(x => x));
    const _show = toSignal(show$, {initialValue: false});
    const show = computed(() => _show() && this.show());
    effect(() => this.toggleDialog(show()));
  }

  private toggleDialog(show: boolean) {
    if (this.instance) {
      this.manager.closeDialog(this.instance);
      this.instanceSub?.unsubscribe();
    }

    if (!show) return;

    this.instance = this.manager.createDialog(
      {
        content: signal(this),
        footer: signal(undefined),
        header: this.header,
        scrollable: this.scrollable,
        canClose: this.canClose,
        type: computed(() => this.type() ?? this.defaults.type),
        styles: computed(() => setToArr(arrToSet([...this.styles(), ...this.defaults.styles]))),
      },
      this.injector
    );

    this.instanceSub = this.instance.close$.subscribe(() => this.closeDialog());
  }

  ngOnDestroy() {
    this.instanceSub?.unsubscribe();
    if (!this.instance) return;
    this.manager.closeDialog(this.instance);
  }
}
