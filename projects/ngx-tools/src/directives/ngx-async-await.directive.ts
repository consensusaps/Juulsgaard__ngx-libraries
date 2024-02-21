import {Directive, effect, EmbeddedViewRef, input, InputSignal, TemplateRef, ViewContainerRef} from '@angular/core';
import {EMPTY, mergeWith, Observable} from "rxjs";
import {
  AsyncObject, AsyncObjectMapper, AsyncOrSyncObject, AsyncVal, AsyncValueMapper, isSubscribable, UnwrappedAsyncObject,
  UnwrappedAsyncVal
} from "@juulsgaard/rxjs-tools";
import {Dispose} from "../decorators";
import {isObject, shallowEquals} from "@juulsgaard/ts-tools";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {distinctUntilChanged} from "rxjs/operators";

type InputVal = AsyncVal<unknown> | AsyncObject<Record<string, unknown>> | undefined | null;

@Directive({selector: '[ngxAsyncAwait]', standalone: true})
export class NgxAsyncAwaitDirective<T extends InputVal> {

  readonly values: InputSignal<T> = input.required<T>({alias: 'ngxAsyncAwait'});
  readonly elseTemplate: InputSignal<TemplateRef<void> | undefined> = input<TemplateRef<void> | undefined>(undefined, {alias: 'ngxAsyncAwaitElse'});

  private view?: EmbeddedViewRef<TemplateContext<T>>;
  private elseView?: EmbeddedViewRef<void>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      const values = this.values();
      if (values == null) this.updateSingle(EMPTY)
      else if (values instanceof Promise) this.updateSingle(values);
      else if (values instanceof Observable || isSubscribable(values)) this.updateSingle(values);
      else if (isObject(values)) this.updateObject(values);
    }, {allowSignalWrites: true});

    effect(() => {
      this.destroyElse();
      if (this.elseTemplate() && !this.view) {
        this.renderElse();
      }
    });

    this.valueMapper.value$.pipe(
      mergeWith(this.objectMapper.values$),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(value => {
      this.destroyElse();
      this.renderMain(value as MappedValues<T>);
    });
  }

  //<editor-fold desc="Render Controls">
  destroyMain() {
    if (!this.view) return;
    this.view.destroy();
    this.view = undefined;
  }

  renderMain(values: MappedValues<T>) {
    if (!this.view) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxAsyncAwait: values});
      this.view.markForCheck();
    } else {
      this.view.context.ngxAsyncAwait = values;
      this.view.markForCheck();
    }
  }

  destroyElse() {
    if (!this.elseView) return;
    this.elseView.destroy();
    this.elseView = undefined;
  }

  renderElse() {
    if (this.elseView) return;
    const elseTmpl = this.elseTemplate();
    if (!elseTmpl) return;
    this.elseView = this.viewContainer.createEmbeddedView(elseTmpl);
    this.elseView.markForCheck();
  }

  //</editor-fold>

  private oldVal?: AsyncVal<unknown>;
  @Dispose private valueMapper = new AsyncValueMapper<unknown>();

  updateSingle(value: AsyncVal<unknown>) {
    this.objectMapper.reset();
    this.oldObject = undefined;

    if (this.oldVal === value) return;
    this.oldVal = value;

    if (!this.view) {
      this.valueMapper.update(value);
      return;
    }

    let emitted = this.valueMapper.update(value);

    if (!emitted) {
      this.destroyMain();
      this.renderElse();
    }
  }

  private oldObject?: AsyncOrSyncObject<Record<string, unknown>>;
  @Dispose private objectMapper = new AsyncObjectMapper<Record<string, unknown>>();

  updateObject(values: AsyncOrSyncObject<Record<string, unknown>>) {
    this.valueMapper.reset();
    this.oldVal = undefined;

    if (this.oldObject && shallowEquals(this.oldObject, values)) return;
    this.oldObject = values;

    if (!this.view) {
      this.objectMapper.update(values);
      return;
    }

    let emitted = this.objectMapper.update(values);

    if (!emitted) {
      this.destroyMain();
      this.renderElse();
    }
  }

  static ngTemplateContextGuard<T extends InputVal>(
    directive: NgxAsyncAwaitDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxAsyncAwait: MappedValues<T>;
}

type MappedValues<T> = T extends null | undefined ? never :
  T extends AsyncVal<unknown> ? UnwrappedAsyncVal<T> :
    T extends Record<string, AsyncVal<unknown>> ? UnwrappedAsyncObject<T> :
      never;
