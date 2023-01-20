import {Directive, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef} from "@angular/core";
import {ControlContainer} from "@angular/forms";
import {Subscription} from "rxjs";
import {ControlFormLayer, ControlFormList, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[formList][formListIn]',
  providers: [
    {
      provide: ControlContainer,
      useExisting: FormListDirective
    }
  ]
})
export class FormListDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnChanges, OnDestroy {

  @Input('formListIn') list?: ControlFormList<TControls>;
  @Input('formListWhen') show?: boolean;

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
      for (let control of controls) {
        this.renderControl(control, controls);
      }
    });
  }

  ngOnDestroy() {
    this.listSub?.unsubscribe();
    this.viewContainer.clear();
  }

  private renderControl(layer: ControlFormLayer<TControls>, controls: ControlFormLayer<TControls>[]) {
    const context = new FormListDirectiveContext(layer, controls);
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
  formListIn: TControls[];

  constructor(list: ControlFormLayer<TControls>, controls: ControlFormLayer<TControls>[]) {
    this.$implicit = list.controls;
    this.formListIn = controls.map(x => x.controls);
  }
}
