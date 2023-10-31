import {Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, mergeWith, Observable, Subscribable} from "rxjs";
import {Dispose} from "../decorators";
import {
  AsyncOrSyncTuple, AsyncOrSyncVal, AsyncTupleFallbackMapper, AsyncValueFallbackMapper
} from "@juulsgaard/rxjs-tools";
import {shallowEquals} from "@juulsgaard/ts-tools";

@Directive({selector: '[ngxLet]', standalone: true})
export class NgxLetDirective<T> {

  @Input({required: true, alias: 'ngxLet'}) set values(values: T) {
    if (Array.isArray(values)) this.updateArray(values);
    else this.updateSingle(values);
  }

  private view?: EmbeddedViewRef<TemplateContext<T>>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    this.valueMapper.value$.pipe(mergeWith(this.tupleMapper.values$)).subscribe(x => {
      if (!this.view) {
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxLet: x as MappedValues<T>});
        this.view.markForCheck();
      } else {
        this.view.context = {ngxLet: x as MappedValues<T>};
        this.view.markForCheck();
      }
    })
  }

  private oldVal?: AsyncOrSyncVal<unknown>;
  @Dispose private valueMapper = new AsyncValueFallbackMapper<unknown, null>(null);

  updateSingle(value: AsyncOrSyncVal<unknown>) {
    this.tupleMapper.reset();
    this.oldTuple = undefined;

    if (this.oldVal === value) return;
    this.oldVal = value;

    this.valueMapper.update(value);
  }

  private oldTuple?: AsyncOrSyncTuple<unknown[]>;
  @Dispose private tupleMapper = new AsyncTupleFallbackMapper<unknown[], null>(null);
  updateArray(values: AsyncOrSyncTuple<unknown[]>) {
    this.valueMapper.reset();
    this.oldVal = undefined;

    if (this.oldTuple && shallowEquals(this.oldTuple, values)) return;
    this.oldTuple = values;

    this.tupleMapper.update(values);
  }

  static ngTemplateContextGuard<T>(
    directive: NgxLetDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxLet: MappedValues<T>;
}

type MappedValues<T> = T extends unknown[] ? MappedTuple<T> : MappedVal<T>;
type MappedTuple<T extends unknown[]> = { [K in keyof T]: MappedVal<T[K]> }
type MappedVal<T> =
  T extends Subscribable<infer U> ? U | null :
    T extends Observable<infer U> ? U | null :
      T extends BehaviorSubject<infer U> ? U :
        T extends Promise<infer U> ? U | null :
          T;
