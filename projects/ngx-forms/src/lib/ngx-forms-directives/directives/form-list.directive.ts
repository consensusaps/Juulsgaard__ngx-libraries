import {
  Directive, effect, EmbeddedViewRef, input, InputSignal, signal, TemplateRef, untracked, ViewContainerRef
} from "@angular/core";
import {ControlFormLayer, FormList, FormUnit} from "@juulsgaard/ngx-forms-core";
import {arrToSet} from "@juulsgaard/ts-tools";

@Directive({
  selector: '[ngxFormList][ngxFormListIn]'
})
export class FormListDirective<TControls extends Record<string, FormUnit>> {

  readonly list: InputSignal<FormList<TControls, any, any>> = input.required<FormList<TControls, any, any>>({alias: 'ngxFormListIn'});

  // Disable functionality because of change detection timing
  // readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormListWhen'});
  readonly show = signal(true);

  views = new Map<ControlFormLayer<TControls>, EmbeddedViewRef<FormListDirectiveContext<TControls>>>();

  constructor(
    private templateRef: TemplateRef<FormListDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      if (!this.show()) {
        untracked(() => this.clear());
        return;
      }

      const list = this.list();
      const controls = list.controls();
      const controlList = controls.map(x => x.controls());
      const controlSet = arrToSet(controls);

      untracked(() => {
        // Remove outdated views
        for (let [layer, view] of this.views) {
          if (controlSet.has(layer)) continue;
          view.destroy();
          this.views.delete(layer);
        }

        // Insert or update views
        let index = -1;
        for (let control of controlSet) {
          index++;
          let view = this.views.get(control);

          if (view) {
            this.viewContainer.move(view, index);
            const changed = view.context.update(control, index, controlList);
            if (changed) view.markForCheck();
            continue;
          }

          const context = new FormListDirectiveContext(control, index, controlList);
          view = this.viewContainer.createEmbeddedView(this.templateRef, context, {index});
          view.detectChanges();
          view.markForCheck();
          this.views.set(control, view);
        }
      });
    });
  }

  private clear() {
    for (let [_, view] of this.views) {
      view.destroy();
    }
    this.views.clear();
  }

  static ngTemplateContextGuard<TControls extends Record<string, FormUnit>>(
    directive: FormListDirective<TControls>,
    context: unknown
  ): context is FormListDirectiveContext<TControls> {
    return true;
  }
}

class FormListDirectiveContext<TControls extends Record<string, FormUnit>> {

  $implicit: TControls;
  ngxFormListIn: TControls[];
  index: number;
  layer: ControlFormLayer<TControls>;

  constructor(layer: ControlFormLayer<TControls>, index: number, list: TControls[]) {
    this.layer = layer;
    this.$implicit = layer.controls();
    this.index = index;
    this.ngxFormListIn = list;
  }

  update(layer: ControlFormLayer<TControls>, index: number, list: TControls[]): boolean {
    let changed = false;

    if (this.layer != layer) {
      this.layer = layer;
      changed = true;
    }

    const controls = layer.controls();
    if (this.$implicit !== controls) {
      this.$implicit = controls;
      changed = true;
    }

    if (this.index != index) {
      this.index = index;
      changed = true;
    }

    if (this.ngxFormListIn != list) {
      this.ngxFormListIn = list;
      changed = true;
    }

    return changed;
  }
}
