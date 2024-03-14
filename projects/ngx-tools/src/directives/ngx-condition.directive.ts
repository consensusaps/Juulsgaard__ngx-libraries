import {AsyncOrSyncVal, AsyncValueMapper, UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {
  computed, Directive, effect, EmbeddedViewRef, signal, Signal, TemplateRef, untracked, ViewContainerRef
} from "@angular/core";
import {Dispose} from "../decorators";
import {toSignal} from "@angular/core/rxjs-interop";
import {tap} from "rxjs/operators";

@Directive()
export abstract class NgxConditionDirective<T extends AsyncOrSyncVal<unknown>, TContext extends {}> {

  abstract value: Signal<T>;
  abstract elseTemplate: Signal<TemplateRef<void> | undefined>;
  abstract waitingTemplate: Signal<TemplateRef<void> | undefined>;

  private waitingTmpl = computed(() => this.waitingTemplate() ?? this.elseTemplate());

  private view?: EmbeddedViewRef<TContext>;
  private elseView?: EmbeddedViewRef<void>;
  private waitingView?: EmbeddedViewRef<void>;

  private readonly waiting = signal(false);

  @Dispose private valueMapper = new AsyncValueMapper<any>();

  constructor(
    private templateRef: TemplateRef<TContext>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      let emitted = this.valueMapper.update(this.value());
      this.waiting.set(!emitted);
    }, {allowSignalWrites: true});

    const value$ = this.valueMapper.value$.pipe(
      tap(() => this.waiting.set(false))
    );
    const value = toSignal<UnwrappedAsyncOrSyncVal<T>>(value$);

    effect(() => {
      if (this.waiting()) {
        untracked(() => {
          this.destroyMain();
          this.destroyElse();
          this.renderWaiting();
        });
        return;
      }

      const context = this.buildContext(value() as UnwrappedAsyncOrSyncVal<T>);

      untracked(() => {
        this.destroyWaiting();

        if (context) {
          this.destroyElse();
          this.renderMain(context);
        } else {
          this.destroyMain();
          this.renderElse();
        }
      });
    });
  }

  abstract buildContext(value: UnwrappedAsyncOrSyncVal<T>): TContext | undefined;

  //<editor-fold desc="Render Controls">
  destroyMain() {
    if (!this.view) return;
    this.view.destroy();
    this.view = undefined;
  }

  renderMain(context: TContext) {

    if (!this.view) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef, context);
      this.view.detectChanges();
      this.view.markForCheck();
    } else {
      Object.assign(this.view.context, context);
      this.view.markForCheck();
    }
  }

  destroyWaiting() {
    if (!this.waitingView) return;
    this.waitingView.destroy();
    this.waitingView = undefined;
  }

  renderWaiting() {
    const tmpl = this.waitingTmpl();
    if (!tmpl) return;

    this.waitingView?.destroy();
    this.waitingView = this.viewContainer.createEmbeddedView(tmpl);
    this.waitingView.detectChanges();
    this.waitingView.markForCheck();
  }

  destroyElse() {
    if (!this.elseView) return;
    this.elseView.destroy();
    this.elseView = undefined;
  }

  renderElse() {
    const tmpl = this.elseTemplate();
    if (!tmpl) return;
    this.elseView = this.viewContainer.createEmbeddedView(tmpl);
    this.elseView.detectChanges();
    this.elseView.markForCheck();
  }

  //</editor-fold>
}

