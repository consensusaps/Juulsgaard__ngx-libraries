import {
  Directive, EmbeddedViewRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef
} from '@angular/core';
import {AsyncOrSyncVal, AsyncValueMapper, UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {TruthyTypesOf} from "rxjs";
import {Dispose} from "../decorators";
import {distinctUntilChanged} from "rxjs/operators";

@Directive({selector: '[ngxIf]', standalone: true})
export class NgxIfDirective<T extends AsyncOrSyncVal<unknown>> implements OnChanges {

  @Input({required: true, alias: 'ngxIf'}) value!: T;
  @Input({alias: 'ngxIfElse'}) elseTemplate?: TemplateRef<void>;
  @Input({alias: 'ngxIfWaiting'}) waitingTemplate?: TemplateRef<void>;

  private view?: EmbeddedViewRef<TemplateContext<T>>;
  private elseView?: EmbeddedViewRef<void>;
  private waitingView?: EmbeddedViewRef<void>;
  private get waitingElseView() {return this.waitingTemplate ? undefined : this.waitingView}
  private state: 'waiting'|'else'|'value' = 'waiting';

  @Dispose private valueMapper = new AsyncValueMapper<unknown>();

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    this.valueMapper.value$.pipe(
      distinctUntilChanged()
    ).subscribe(x => {
      this.destroyWaiting();

      if (x) {
        this.destroyElse();
        this.renderMain(x as TruthyTypesOf<UnwrappedAsyncOrSyncVal<T>>);
        this.state = 'value';
      } else {
        this.destroyMain();
        this.renderElse();
        this.state = 'else';
      }
    });
  }

  //<editor-fold desc="Value Updates">
  ngOnChanges(changes: SimpleChanges) {

    if ('value' in changes) {
      this.updateValue(this.value);
    }

    if ('waitingTemplate' in changes && this.state === 'waiting') {
      this.destroyWaiting();
      this.renderWaiting();
    }

    if ('elseTemplate' in changes) {
      if (this.state === 'else') {
        this.destroyElse();
        this.renderElse();
      } else if (this.state === 'waiting' && !this.waitingTemplate) {
        this.destroyWaiting();
        this.renderWaiting();
      }
    }
  }

  private updateValue(value: T) {

    if (this.state === 'waiting') {
      this.valueMapper.update(value);
      return;
    }

    let emitted = this.valueMapper.update(value);

    if (!emitted) {
      this.destroyMain();
      this.destroyElse();
      this.renderWaiting();
      this.state = 'waiting';
    }
  }
  //</editor-fold>

  //<editor-fold desc="Render Controls">
  destroyMain() {
    if (!this.view) return;
    this.view.destroy();
    this.view = undefined;
  }

  renderMain(context: TruthyTypesOf<UnwrappedAsyncOrSyncVal<T>>) {
    if (!this.view) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxIf: context});
      this.view.markForCheck();
    } else {
      this.view.context = {ngxIf: context};
      this.view.markForCheck();
    }
  }

  destroyWaiting() {
    if (!this.waitingView) return;
    this.waitingView.destroy();
    this.waitingView = undefined;
  }

  renderWaiting() {
    if (this.waitingView) return;
    if (!this.waitingTemplate && !this.elseTemplate) return;
    this.waitingView = this.viewContainer.createEmbeddedView(this.waitingTemplate ?? this.elseTemplate!);
    this.waitingView.detectChanges();
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
    this.elseView.detectChanges();
  }
  //</editor-fold>

  static ngTemplateContextGuard<T extends AsyncOrSyncVal<unknown>>(
    directive: NgxIfDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }
}

interface TemplateContext<T> {
  ngxIf: TruthyTypesOf<UnwrappedAsyncOrSyncVal<T>>;
}
