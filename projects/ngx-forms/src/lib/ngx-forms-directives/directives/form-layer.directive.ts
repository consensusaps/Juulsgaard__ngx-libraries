import {
  Directive, EmbeddedViewRef, forwardRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef
} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {AnyControlFormLayer, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[ngxFormLayer]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => FormLayerDirective)
  }]
})
export class FormLayerDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnChanges, OnDestroy {

  @Input('ngxFormLayer') layer?: AnyControlFormLayer<TControls>;
  @Input('ngxFormLayerWhen') show?: boolean;

  view?: EmbeddedViewRef<FormLayerDirectiveContext<TControls>>;

  constructor(
    private templateRef: TemplateRef<FormLayerDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['layer'] && !changes['show']) return;

    this.view?.destroy();

    if (this.show === false) return;
    if (!this.layer) return;

    const context = new FormLayerDirectiveContext(this.layer);
    const view = this.viewContainer.createEmbeddedView(this.templateRef, context);
    const sub = this.layer.controls$.subscribe(controls => {
      context.ngxFormLayer = controls;
      view?.detectChanges();
    });
    view.onDestroy(() => sub.unsubscribe());

    this.view = view;
  }

  ngOnDestroy() {
    this.view?.destroy();
  }

  get control() {
    return this.layer ?? null;
  }
}

class FormLayerDirectiveContext<TControls extends Record<string, SmartFormUnion>> {

  ngxFormLayer: TControls;

  constructor(form: AnyControlFormLayer<TControls>) {
    this.ngxFormLayer = form.controls;
  }
}
