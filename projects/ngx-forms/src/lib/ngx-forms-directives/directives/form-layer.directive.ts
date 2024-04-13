import {
  Directive, effect, EmbeddedViewRef, input, InputSignal, signal, TemplateRef, untracked, ViewContainerRef
} from '@angular/core';
import {FormLayer, FormUnit} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxFormLayer]',
})
export class FormLayerDirective<TControls extends Record<string, FormUnit>> {

  readonly layer: InputSignal<FormLayer<TControls, any>> = input.required({alias: 'ngxFormLayer'});

  // Disable functionality because of change detection timing
  // readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormLayerWhen'});
  readonly show = signal(true);

  view?: EmbeddedViewRef<FormLayerDirectiveContext<TControls>>;

  constructor(
    private templateRef: TemplateRef<FormLayerDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      if (!this.show()) {
        untracked(() => {
          this.view?.destroy();
          this.view = undefined;
        });
        return;
      }

      const controls = this.layer().controls();

      untracked(() => {
        if (!this.view) {
          const context = {ngxFormLayer: controls};
          this.view = this.viewContainer.createEmbeddedView(this.templateRef, context);
          this.view.detectChanges();
          this.view.markForCheck();
          return;
        }

        this.view.context.ngxFormLayer = controls;
        this.view.markForCheck();
      });
    });
  }

  static ngTemplateContextGuard<TControls extends Record<string, FormUnit>>(
    directive: FormLayerDirective<TControls>,
    context: unknown
  ): context is FormLayerDirectiveContext<TControls> {
    return true;
  }
}

interface FormLayerDirectiveContext<TControls extends Record<string, FormUnit>> {
  ngxFormLayer: TControls;
}
