import {Directive, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef} from "@angular/core";
import {ControlContainer} from "@angular/forms";
import {Subscription} from "rxjs";
import {AnyControlFormList, ControlFormLayer, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[ngxFormList][ngxFormListIn]',
  providers: [
    {
      provide: ControlContainer,
      useExisting: FormListDirective
    }
  ]
})
export class FormListDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnChanges, OnDestroy {

  @Input('ngxFormListIn') list?: AnyControlFormList<TControls>;
  @Input('ngxFormListWhen') show?: boolean;

  listSub?: Subscription;

  constructor(
    private templateRef: TemplateRef<FormListDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['list'] && !changes['show']) return;

    if (this.listSub) {
      this.listSub.unsubscribe();
      this.viewContainer.clear();
    }

    if (this.show === false) return;
    if (!this.list) return;

    this.listSub = this.list.controls$.subscribe(controls => {
      let index = 0;
      for (let control of controls) {
        this.renderControl(control, index++, controls);
      }
    });
  }

  ngOnDestroy() {
    this.listSub?.unsubscribe();
    this.viewContainer.clear();
  }

  private renderControl(layer: ControlFormLayer<TControls>, index: number, controls: ControlFormLayer<TControls>[]) {
    const context = new FormListDirectiveContext(layer, index, controls);
    const view = this.viewContainer.createEmbeddedView(this.templateRef, context);
    const sub = layer.controls$.subscribe(controls => {
      context.$implicit = controls;
      view?.detectChanges();
    });
    view.onDestroy(() => sub.unsubscribe());
  }

  get control() {
    return this.list ?? null;
  }
}

class FormListDirectiveContext<TControls extends Record<string, SmartFormUnion>> {

  $implicit: TControls;
  ngxFormListIn: TControls[];
  index: number;
  layer: ControlFormLayer<TControls>;

  constructor(layer: ControlFormLayer<TControls>, index: number, controls: ControlFormLayer<TControls>[]) {
    this.layer = layer;
    this.$implicit = layer.controls;
    this.ngxFormListIn = controls.map(x => x.controls);
    this.index = index;
  }
}
