import {
  Directive, EmbeddedViewRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef
} from '@angular/core';
import {mergeWith} from "rxjs";
import {Dispose} from "../decorators";
import {
  AsyncOrSyncTuple, AsyncOrSyncVal, AsyncTupleMapper, AsyncValueMapper, UnwrappedAsyncOrSyncTuple,
  UnwrappedAsyncOrSyncVal
} from "@juulsgaard/rxjs-tools";
import {shallowEquals} from "@juulsgaard/ts-tools";

@Directive({selector: '[ngxLetAwait]', standalone: true})
export class NgxLetAwaitDirective<T> implements OnChanges {

  @Input({required: true, alias: 'ngxLetAwait'}) values!: T;
  @Input({alias: 'ngxLetAwaitElse'}) elseTemplate?: TemplateRef<void>;

  private view?: EmbeddedViewRef<TemplateContext<T>>;
  private elseView?: EmbeddedViewRef<void>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    this.valueMapper.value$.pipe(mergeWith(this.tupleMapper.values$)).subscribe(x => {
      this.destroyElse();
      this.renderMain(x as MappedValues<T>);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('values' in changes) {
      if (Array.isArray(this.values)) this.updateArray(this.values);
      else this.updateSingle(this.values);
    }

    if ('elseTemplate' in changes) {
      this.destroyElse();

      if (this.elseTemplate && !this.view) {
        this.renderElse();
      }
    }
  }

  //<editor-fold desc="Render Controls">
  destroyMain() {
    if (!this.view) return;
    this.view.destroy();
    this.view = undefined;
  }

  renderMain(context: MappedValues<T>) {
    if (!this.view) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxLetAwait: context});
      this.view.markForCheck();
    } else {
      this.view.context = {ngxLetAwait: context};
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
    if (!this.elseTemplate) return;
    this.elseView = this.viewContainer.createEmbeddedView(this.elseTemplate);
  }
  //</editor-fold>

  private oldVal?: AsyncOrSyncVal<unknown>;
  @Dispose private valueMapper = new AsyncValueMapper<unknown>();

  updateSingle(value: AsyncOrSyncVal<unknown>) {
    this.tupleMapper.reset();
    this.oldTuple = undefined;

    if (this.oldVal === value) return;
    this.oldVal = value;

    if (!this.view) {
      this.valueMapper.update(value);
      return;
    }

    let emitted = false;
    const sub = this.valueMapper.value$.subscribe(() => emitted = true);
    this.valueMapper.update(value);
    sub.unsubscribe();

    if (!emitted) {
      this.destroyMain();
      this.renderElse();
    }
  }

  private oldTuple?: AsyncOrSyncTuple<unknown[]>;
  @Dispose private tupleMapper = new AsyncTupleMapper<unknown[]>();
  updateArray(values: AsyncOrSyncTuple<unknown[]>) {
    this.valueMapper.reset();
    this.oldVal = undefined;

    if (this.oldTuple && shallowEquals(this.oldTuple, values)) return;
    this.oldTuple = values;

    if (!this.view) {
      this.tupleMapper.update(values);
      return;
    }

    let emitted = false;
    const sub = this.tupleMapper.values$.subscribe(() => emitted = true);
    this.tupleMapper.update(values);
    sub.unsubscribe();

    if (!emitted) {
      this.destroyMain();
      this.renderElse();
    }
  }

  static ngTemplateContextGuard<T>(
    directive: NgxLetAwaitDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxLetAwait: MappedValues<T>;
}

type MappedValues<T> = T extends unknown[] ? UnwrappedAsyncOrSyncTuple<T> : UnwrappedAsyncOrSyncVal<T>;
