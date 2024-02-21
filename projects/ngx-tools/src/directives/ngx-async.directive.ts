import {Directive, effect, EmbeddedViewRef, input, InputSignal, TemplateRef, ViewContainerRef} from '@angular/core';
import {EMPTY, mergeWith, Observable} from "rxjs";
import {
  AsyncObject, AsyncObjectFallbackMapper, AsyncVal, AsyncValueFallbackMapper, isSubscribable, UnwrappedAsyncObject,
  UnwrappedAsyncVal
} from "@juulsgaard/rxjs-tools";
import {Dispose} from "../decorators";
import {isObject, shallowEquals} from "@juulsgaard/ts-tools";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {distinctUntilChanged} from "rxjs/operators";

type InputVal = AsyncVal<unknown>|AsyncObject<Record<string, unknown>>|undefined|null;

@Directive({selector: '[ngxAsync]', standalone: true})
export class NgxAsyncDirective<T extends InputVal> {

  readonly values: InputSignal<T> = input.required<T>({alias: 'ngxAsync'});

  private view?: EmbeddedViewRef<TemplateContext<T>>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      const values = this.values();
      if (values == null) this.updateSingle(EMPTY);
      else if (values instanceof Promise) this.updateSingle(values);
      else if (values instanceof Observable || isSubscribable(values)) this.updateSingle(values);
      else if (isObject(values)) this.updateObject(values);
    }, {allowSignalWrites: true});

    this.valueMapper.value$.pipe(
      mergeWith(this.objectMapper.values$),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(value => this.render(value as MappedValues<T>));
  }

  private render(value: MappedValues<T>) {
    if (!this.view) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxAsync: value as MappedValues<T>});
      this.view.markForCheck();
    } else {
      this.view.context.ngxAsync = value;
      this.view.markForCheck();
    }
  }

  private oldVal?: AsyncVal<unknown>;
  @Dispose private valueMapper = new AsyncValueFallbackMapper<unknown, null>(null);

  updateSingle(value: AsyncVal<unknown>) {
    // Reset object path
    this.objectMapper.reset();
    this.oldObject = undefined;

    if (this.oldVal === value) return;
    this.oldVal = value;

    this.valueMapper.update(value);
  }

  private oldObject?: AsyncObject<Record<string, unknown>>;
  @Dispose private objectMapper = new AsyncObjectFallbackMapper<Record<string, unknown>, null>(null);

  updateObject(values: AsyncObject<Record<string, unknown>>) {
    // Reset single path
    this.valueMapper.reset();
    this.oldVal = undefined;

    if (this.oldObject && shallowEquals(this.oldObject, values)) return;
    this.oldObject = values;

    this.objectMapper.update(values);
  }

  static ngTemplateContextGuard<T extends InputVal>(
    directive: NgxAsyncDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxAsync: MappedValues<T>;
}

type MappedValues<T> = T extends null|undefined ? null :
  T extends AsyncVal<unknown> ? UnwrappedAsyncVal<T, null> :
  T extends Record<string, AsyncVal<unknown>> ? UnwrappedAsyncObject<T, null> :
    never;
