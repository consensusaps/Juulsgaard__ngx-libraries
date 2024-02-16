import {Directive, effect, EmbeddedViewRef, input, TemplateRef, ViewContainerRef} from '@angular/core';
import {mergeWith, Observable} from "rxjs";
import {
  AsyncObject, AsyncObjectFallbackMapper, AsyncVal, AsyncValueFallbackMapper, isSubscribable, UnwrappedAsyncObject,
  UnwrappedAsyncVal
} from "@juulsgaard/rxjs-tools";
import {Dispose} from "../decorators";
import {isObject, shallowEquals} from "@juulsgaard/ts-tools";
import {toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[ngxAsync]', standalone: true})
export class NgxAsyncDirective<T extends AsyncVal<unknown>|AsyncObject<Record<string, unknown>>> {

  values = input.required<T>({alias: 'ngxAsync'});

  private view?: EmbeddedViewRef<TemplateContext<T>>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      const values = this.values();
      if (values instanceof Promise) this.updateSingle(values);
      else if (values instanceof Observable || isSubscribable(values)) this.updateSingle(values);
      else if (isObject(values)) this.updateObject(values);
    });

    const value = toSignal(this.valueMapper.value$.pipe(mergeWith(this.objectMapper.values$)));

    effect(() => {
      if (!this.view) {
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxAsync: value() as MappedValues<T>});
        this.view.markForCheck();
      } else {
        this.view.context = {ngxAsync: value() as MappedValues<T>};
        this.view.markForCheck();
      }
    });
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

  static ngTemplateContextGuard<T extends AsyncVal<unknown>|AsyncObject<Record<string, unknown>>>(
    directive: NgxAsyncDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxAsync: MappedValues<T>;
}

type MappedValues<T> = T extends AsyncVal<unknown> ? UnwrappedAsyncVal<T, null> :
  T extends Record<string, AsyncVal<unknown>> ? UnwrappedAsyncObject<T, null> :
    never;
