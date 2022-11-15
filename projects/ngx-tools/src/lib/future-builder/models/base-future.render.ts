import {ChangeDetectorRef, EmbeddedViewRef, TemplateRef, ViewContainerRef} from "@angular/core";

export abstract class BaseFutureRender<TContext> {

  protected constructor(
    protected templateRef: TemplateRef<TContext>,
    protected viewContainer: ViewContainerRef,
    protected changes: ChangeDetectorRef
  ) {
  }

  protected embeddedView?: EmbeddedViewRef<TContext>;

  updateView(context: TContext | undefined) {
    if (this.embeddedView) {

      if (!context) {
        this.viewContainer.clear();
        this.embeddedView = undefined;
        this.changes.detectChanges();
        return;
      }

      this.embeddedView.context = context;
      this.embeddedView.detectChanges();
      return;
    }

    if (!context) return;
    this.embeddedView = this.viewContainer.createEmbeddedView(this.templateRef, context);
    this.changes.detectChanges();
  }
}
