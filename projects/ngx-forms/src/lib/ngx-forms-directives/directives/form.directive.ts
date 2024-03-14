import {
  Directive, effect, EmbeddedViewRef, forwardRef, input, InputSignalWithTransform, signal, TemplateRef, untracked,
  ViewContainerRef
} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {AnyControlFormRoot, isFormRoot, SmartFormUnion} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxForm]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => FormDirective)
  }]
})
export class FormDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer {

  form: InputSignalWithTransform<
    AnyControlFormRoot<TControls>,
    AnyControlFormRoot<TControls> | { form: AnyControlFormRoot<TControls> }
  > = input.required({
    alias: 'ngxForm',
    transform: (form: AnyControlFormRoot<TControls>|{form: AnyControlFormRoot<TControls>}) => isFormRoot(form) ? form : form.form
  });

  // Disable functionality because of change detection timing
  // readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormWhen'});
  readonly show = signal(true);

  view?: EmbeddedViewRef<FormDirectiveContext<TControls>>

  constructor(
    private templateRef: TemplateRef<FormDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();

    effect(() => {
      if (!this.show()) {
        untracked(() => {
          this.view?.destroy();
          this.view = undefined;
        });
        return;
      }

      const controls =  this.form().controlsSignal();

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

  static ngTemplateContextGuard<TControls extends Record<string, SmartFormUnion>>(
    directive: FormDirective<TControls>,
    context: unknown
  ): context is FormDirectiveContext<TControls> {
    return true;
  }
}

interface FormDirectiveContext<TControls extends Record<string, SmartFormUnion>> {
  ngxForm: TControls;
}
