import {
  Directive, effect, EmbeddedViewRef, forwardRef, input, InputSignalWithTransform, signal, TemplateRef, untracked,
  ViewContainerRef
} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {FormRoot, FormUnit, isFormRoot} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxForm]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => FormDirective)
  }]
})
export class FormDirective<TControls extends Record<string, FormUnit>> {

  form: InputSignalWithTransform<
    FormRoot<TControls, any>,
    FormRoot<TControls, any> | { readonly form: FormRoot<TControls, any> }
  > = input.required({
    alias: 'ngxForm',
    transform: (form: FormRoot<TControls, any>|{readonly form: FormRoot<TControls, any>}) => isFormRoot(form) ? form : form.form
  });

  // Disable functionality because of change detection timing
  // readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormWhen'});
  readonly show = signal(true);

  view?: EmbeddedViewRef<FormDirectiveContext<TControls>>

  constructor(
    private templateRef: TemplateRef<FormDirectiveContext<TControls>>,
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

      const controls =  this.form().controls();

      untracked(() => {
        if (!this.view) {
          const context = {ngxForm: controls};
          this.view = this.viewContainer.createEmbeddedView(this.templateRef, context);
          this.view.detectChanges();
          this.view.markForCheck();
          return;
        }

        this.view.context.ngxForm = controls;
        this.view.markForCheck();
      });
    });
  }

  get control() {
    return this.form();
  }

  static ngTemplateContextGuard<TControls extends Record<string, FormUnit>>(
    directive: FormDirective<TControls>,
    context: unknown
  ): context is FormDirectiveContext<TControls> {
    return true;
  }
}

interface FormDirectiveContext<TControls extends Record<string, FormUnit>> {
  ngxForm: TControls;
}
