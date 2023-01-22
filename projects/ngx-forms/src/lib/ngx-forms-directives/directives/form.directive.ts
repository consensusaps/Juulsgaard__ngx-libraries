import {
  Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef
} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {AnyControlFormRoot, isFormRoot, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[ngxForm]',
  providers: [{
    provide: ControlContainer,
    useExisting: FormDirective
  }]
})
export class FormDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnChanges, OnDestroy {

  @Input('ngxForm') form?: AnyControlFormRoot<TControls>|{form: AnyControlFormRoot<TControls>};
  @Input('ngxFormWhen') show?: boolean;

  view?: EmbeddedViewRef<FormDirectiveContext<TControls>>

  constructor(
    private templateRef: TemplateRef<FormDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['form'] && !changes['show']) return;

    this.view?.destroy();

    if (this.show === false) return;
    if (!this.form) return;
    const form = isFormRoot(this.form) ? this.form : this.form.form;

    const context = new FormDirectiveContext(form);
    const view = this.viewContainer.createEmbeddedView(this.templateRef, context);
    const sub = form.controls$.subscribe(controls => {
      context.ngxForm = controls;
      view?.detectChanges();
    });
    view.onDestroy(() => sub.unsubscribe());

    this.view = view;
  }

  ngOnDestroy() {
    this.view?.destroy();
  }

  get control() {
    if (!this.form) return null;
    return isFormRoot(this.form) ? this.form : this.form.form;
  }
}

class FormDirectiveContext<TControls extends Record<string, SmartFormUnion>> {

  ngxForm: TControls;

  constructor(form: AnyControlFormRoot<TControls>) {
    this.ngxForm = form.controls;
  }
}
