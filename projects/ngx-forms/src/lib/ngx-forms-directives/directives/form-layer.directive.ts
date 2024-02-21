import {
  Directive, effect, EmbeddedViewRef, forwardRef, input, InputSignal, TemplateRef, ViewContainerRef
} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {AnyControlFormLayer, SmartFormUnion} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxFormLayer]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => FormLayerDirective)
  }]
})
export class FormLayerDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer {

  readonly layer: InputSignal<AnyControlFormLayer<TControls>> = input.required({alias: 'ngxFormLayer'});
  readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormLayerWhen'});

  view?: EmbeddedViewRef<FormLayerDirectiveContext<TControls>>;

  constructor(
    private templateRef: TemplateRef<FormLayerDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();

    effect(() => {
      if (!this.show()) {
        this.view?.destroy();
        this.view = undefined;
        return;
      }

      if (!this.view) {
        const context = {ngxFormLayer: this.layer().controlsSignal()};
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, context);
        this.view.detectChanges();
        return;
      }

      this.view.context.ngxFormLayer = this.layer().controlsSignal();
      this.view.detectChanges();
    });
  }

  get control() {
    return this.layer();
  }

  static ngTemplateContextGuard<TControls extends Record<string, SmartFormUnion>>(
    directive: FormLayerDirective<TControls>,
    context: unknown
  ): context is FormLayerDirectiveContext<TControls> {
    return true;
  }
}

interface FormLayerDirectiveContext<TControls extends Record<string, SmartFormUnion>> {
  ngxFormLayer: TControls;
}
