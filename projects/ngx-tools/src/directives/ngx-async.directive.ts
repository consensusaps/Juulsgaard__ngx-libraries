import {Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, mergeWith, Observable, Subscribable} from "rxjs";
import {
  AsyncObjectFallbackMapper, AsyncOrSyncObject, AsyncVal, AsyncValueFallbackMapper, isSubscribable
} from "@juulsgaard/rxjs-tools";
import {Dispose} from "../decorators";
import {isObject} from "@juulsgaard/ts-tools";

@Directive({selector: '[ngxAsync]', standalone: true})
export class NgxAsyncDirective<T extends AsyncVal<unknown>|AsyncOrSyncObject<Record<string, unknown>>> {

  @Input({required: true, alias: 'ngxAsync'}) set values(values: T) {
    if (values instanceof Promise) this.updateSingle(values);
    else if (values instanceof Observable || isSubscribable(values)) this.updateSingle(values);
    else if (isObject(values)) this.updateObject(values);
  }

  private view?: EmbeddedViewRef<TemplateContext<T>>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    this.valueMapper.value$.pipe(mergeWith(this.objectMapper.values$)).subscribe(x => {
      if (!this.view) {
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxAsync: x as MappedValues<T>});
        this.view.markForCheck();
      } else {
        this.view.context = {ngxAsync: x as MappedValues<T>};
        this.view.markForCheck();
      }
    })
  }

  private oldVal?: AsyncVal<unknown>;
  @Dispose private valueMapper = new AsyncValueFallbackMapper<unknown, null>(null);

  updateSingle(value: AsyncVal<unknown>) {
    this.objectMapper.reset();

    if (this.oldVal === value) return;
    this.oldVal = value;

    this.valueMapper.update(value);
  }

  @Dispose private objectMapper = new AsyncObjectFallbackMapper<Record<string, unknown>, null>(null);
  updateObject(values: Record<string, unknown>) {

    this.valueMapper.reset();
    this.objectMapper.update(values);
  }

  static ngTemplateContextGuard<T extends AsyncVal<unknown>|AsyncOrSyncObject<Record<string, unknown>>>(
    directive: NgxAsyncDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxAsync: MappedValues<T>;
}

type MappedValues<T> = T extends Subscribable<unknown>|Observable<unknown>|Promise<unknown> ? MappedVal<T> :
  T extends Record<string, unknown> ? MappedObject<T> :
    never;

type MappedObject<T extends Record<string, unknown>> = { [K in keyof T]: MappedVal<T[K]> }

type MappedVal<T> =
  T extends Subscribable<infer U> ? U | null :
    T extends Observable<infer U> ? U | null :
      T extends BehaviorSubject<infer U> ? U :
        T extends Promise<infer U> ? U | null :
          T;
