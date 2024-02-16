import {AsyncOrSyncVal, AsyncValueMapper, UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {
  Directive, effect, EmbeddedViewRef, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef
} from "@angular/core";
import {Dispose} from "../decorators";
import {toSignal} from "@angular/core/rxjs-interop";

@Directive()
export abstract class NgxConditionDirective<T extends AsyncOrSyncVal<unknown>, TContext> implements OnChanges {
  abstract value: T;
  abstract elseTemplate?: TemplateRef<void>;
  abstract waitingTemplate?: TemplateRef<void>;

  private view?: EmbeddedViewRef<TContext>;
  private elseView?: EmbeddedViewRef<void>;
  private waitingView?: EmbeddedViewRef<void>;

  private state: 'waiting' | 'else' | 'value' = 'waiting';

  @Dispose private valueMapper = new AsyncValueMapper<any>();

  constructor(
    private templateRef: TemplateRef<TContext>,
    private viewContainer: ViewContainerRef
  ) {
    const value = toSignal<UnwrappedAsyncOrSyncVal<T>>(this.valueMapper.value$);

    effect(() => {
      this.destroyWaiting();

      const context = this.buildContext(value() as UnwrappedAsyncOrSyncVal<T>);

      if (context) {
        this.destroyElse();
        this.renderMain(context);
        this.state = 'value';
      } else {
        this.destroyMain();
        this.renderElse();
        this.state = 'else';
      }
    });
  }

  abstract buildContext(value: UnwrappedAsyncOrSyncVal<T>): TContext|undefined;

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

  renderMain(context: TContext) {

    if (!this.view) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef, context);
      this.view.markForCheck();
    } else {
      this.view.context = context;
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
}

