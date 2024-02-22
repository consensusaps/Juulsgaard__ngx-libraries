import {ChangeDetectorRef, EmbeddedViewRef, TemplateRef, ViewContainerRef} from "@angular/core";

export abstract class BaseFutureRender<TContext extends {}> {

  protected constructor(
    protected templateRef: TemplateRef<TContext>,
    protected viewContainer: ViewContainerRef,
    protected changes: ChangeDetectorRef
  ) {
  }

  protected embeddedView?: EmbeddedViewRef<TContext>;

  updateView(context: TContext | undefined) {
    queueMicrotask(() => {
      if (this.embeddedView) {

        if (!context) {
          this.embeddedView.destroy();
          this.embeddedView = undefined;
          return;
        }

        Object.assign(this.embeddedView.context, context);
        this.embeddedView.detectChanges();
        return;
      }

      if (!context) return;
      this.embeddedView = this.viewContainer.createEmbeddedView(this.templateRef, context);
      this.embeddedView.detectChanges();
    });
  }
}
