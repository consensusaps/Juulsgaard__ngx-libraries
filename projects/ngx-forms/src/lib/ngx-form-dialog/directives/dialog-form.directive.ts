import {
  computed, Directive, effect, EmbeddedViewRef, input, InputSignalWithTransform, signal, TemplateRef, untracked,
  ViewContainerRef
} from "@angular/core";
import {AnyControlFormRoot, FormDialog, SmartFormUnion} from "@juulsgaard/ngx-forms-core";

/** Form rendering for a FormDialog. Can only be used inside Form Dialogs */
@Directive({selector: '[dialogForm]'})
export class FormDialogDirective<TControls extends Record<string, SmartFormUnion>> {

  form: InputSignalWithTransform<
    AnyControlFormRoot<TControls>,
    { form: AnyControlFormRoot<TControls> } & FormDialog<any>
  > = input.required({
    alias: 'dialogForm',
    transform: (form: { form: AnyControlFormRoot<TControls> } & FormDialog<any>) => form.form
  });

  private view?: EmbeddedViewRef<DialogFormContext<TControls>>;
  readonly show = signal(false);

  constructor(
    public readonly viewContainer: ViewContainerRef,
    public readonly template: TemplateRef<DialogFormContext<TControls>>,
  ) {

    const controls = computed(() => this.form().controlsSignal());

    effect(() => {

      if (!this.show()) {
        untracked(() => {
          this.view?.destroy();
          this.view = undefined;
        });
        return;
      }

      const _controls = controls();

      untracked(() => {
        if (!this.view) {
          this.view = this.viewContainer.createEmbeddedView(this.template, {dialogForm: _controls});
          this.view.markForCheck();
          return;
        }

        this.view.context.dialogForm = _controls;
        this.view.markForCheck();
      });
    });
  }

  static ngTemplateContextGuard<TControls extends Record<string, SmartFormUnion>>(
    directive: FormDialogDirective<TControls>,
    context: unknown
  ): context is DialogFormContext<TControls> {
    return true;
  }
}

export interface DialogFormContext<TControls extends Record<string, SmartFormUnion>> {
  dialogForm: TControls;
}
