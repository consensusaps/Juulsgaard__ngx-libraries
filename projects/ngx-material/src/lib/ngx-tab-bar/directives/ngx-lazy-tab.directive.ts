import {
  booleanAttribute, computed, Directive, effect, EmbeddedViewRef, forwardRef, inject, input, TemplateRef,
  ViewContainerRef
} from "@angular/core";
import {NgxTabContext} from "../services";
import {UIScopeContext} from "../../../models";
import {titleCase} from "@juulsgaard/ts-tools";

@Directive({
  selector: '[ngxLazyTab]',
  providers: [
    {provide: NgxTabContext, useExisting: forwardRef(() => NgxLazyTabDirective)},
    UIScopeContext.ProvideChild()
  ]
})
export class NgxLazyTabDirective extends NgxTabContext {

  private templateRef = inject(TemplateRef<void>);
  private viewContainer = inject(ViewContainerRef);

  slug = input.required<string>({alias: 'ngxLazyTab'});
  tabName = input<string|undefined>(undefined, {alias: 'ngxLazyTabName'});
  name = computed(() => this.tabName() ?? titleCase(this.slug()));

  disabled = input(false, {transform: booleanAttribute, alias: 'ngxLazyTabDisabled'});
  hide = input(false, {transform: booleanAttribute, alias: 'ngxLazyTabHide'});

  constructor() {
    super();
    effect(() => this.updateView(this.isOpen()));
  }

  view?: EmbeddedViewRef<void>;
  private updateView(show: boolean) {

    if (this.view) {
      if (show) return;
      this.view.destroy();
      this.view = undefined;
      return;
    }

    if (!show) return;
    this.view = this.viewContainer.createEmbeddedView(this.templateRef);
    this.view.detectChanges();
  }
}
