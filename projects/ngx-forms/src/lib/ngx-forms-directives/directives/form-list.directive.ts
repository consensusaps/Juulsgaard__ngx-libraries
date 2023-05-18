import {
  Directive, forwardRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef, ViewRef
} from "@angular/core";
import {ControlContainer} from "@angular/forms";
import {Subscription} from "rxjs";
import {AnyControlFormList, ControlFormLayer, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[ngxFormList][ngxFormListIn]',
  providers: [
    {
      provide: ControlContainer,
      useExisting: forwardRef(() => FormListDirective)
    }
  ]
})
export class FormListDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnChanges, OnDestroy {

  @Input('ngxFormListIn') list?: AnyControlFormList<TControls>;
  @Input('ngxFormListWhen') show?: boolean;

  listSub?: Subscription;
  views = new Map<ControlFormLayer<TControls>, ListItem<TControls>>();

  constructor(
    private templateRef: TemplateRef<FormListDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['list'] && !changes['show']) return;

    this.listSub?.unsubscribe();

    if (this.show === false || !this.list) {
      this.viewContainer.clear();
      this.views.clear();
      return;
    }

    this.listSub = this.list.controls$.subscribe(controls => {

      const newControls = new Set(controls);

      for (let [control, view] of this.views) {
        if (newControls.has(control)) continue;
        view.view.destroy();
      }

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

    let view = this.views.get(layer);

    if (view) {
      const oldIndex = this.viewContainer.indexOf(view.view);
      if (oldIndex !== index) this.viewContainer.move(view.view, index);
      view.context.updateList(index, controls);
      view.view.detectChanges();
      return;
    }

    const viewRef = this.viewContainer.createEmbeddedView(this.templateRef, context, index);
    view = {view: viewRef, context};
    this.views.set(layer, view);

    const sub = layer.controls$.subscribe(controls => {
      context.updateControls(controls);
      viewRef?.detectChanges();
    });

    viewRef.onDestroy(() => sub.unsubscribe());
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

  updateList(index: number, controls: ControlFormLayer<TControls>[]) {
    this.ngxFormListIn = controls.map(x => x.controls);
    this.index = index;
  }

  updateControls(controls: TControls) {
    this.$implicit = controls;
  }
}

interface ListItem<TControls extends Record<string, SmartFormUnion>> {
  view: ViewRef;
  context: FormListDirectiveContext<TControls>;
}
