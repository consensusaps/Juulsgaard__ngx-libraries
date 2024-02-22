import {
  booleanAttribute, ChangeDetectionStrategy, Component, effect, inject, Injector, input, InputSignal,
  InputSignalWithTransform, OnDestroy, signal, viewChild
} from '@angular/core';
import {FormDialog} from "@juulsgaard/ngx-forms-core";
import {DialogManagerService, NgxDialogDefaults, TemplateDialogInstance} from "@juulsgaard/ngx-material";
import {RenderSourceDirective} from "@juulsgaard/ngx-tools";
import {FormDialogDirective} from "../../directives/dialog-form.directive";

@Component({
  selector: 'ngx-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialogComponent<T extends Record<string, any>> implements OnDestroy {

  readonly config: InputSignal<FormDialog<T>> = input.required<FormDialog<T>>();
  readonly formTemplate = viewChild(FormDialogDirective);
  readonly content = viewChild.required('content', {read: RenderSourceDirective});
  readonly footer = viewChild.required('footer', {read: RenderSourceDirective});
  readonly canClose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  private defaults = inject(NgxDialogDefaults);
  instance?: TemplateDialogInstance;

  constructor(private manager: DialogManagerService, private injector: Injector) {

    effect(() => {
      const template = this.formTemplate();
      if (!template) return;
      template.show.set(this.config().showSignal());
    }, {allowSignalWrites: true});

    effect(() => {
      const config = this.config();

      this.destroy();
      if (!config.showSignal()) return;

      this.instance = this.manager.createDialog(
        {
          content: this.content,
          footer: this.footer,
          header: signal(config.title),
          scrollable: signal(true),
          canClose: this.canClose,
          type: signal(this.defaults.type),
          styles: signal(this.defaults.styles)
        },
        this.injector
      );

      this.instance.close$.subscribe(() => config.close());
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (!this.instance) return;
    this.manager.closeDialog(this.instance);
  }

  async formSubmit() {
    const config = this.config();
    if (!config.submitOnEnter) return;
    await config.submit();
  }

  async onEnter(event: Event|KeyboardEvent) {
    const config = this.config();
    if (!config.submitOnEnter) return;
    if ('repeat' in event && event.repeat) return;
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT') return;
    await config.submit();
  }
}
