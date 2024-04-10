import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, effect, inject, Injector, input,
  InputSignal, InputSignalWithTransform, OnDestroy, signal, viewChild
} from '@angular/core';
import {FormDialog} from "@juulsgaard/ngx-forms-core";
import {DialogManagerService, NgxDialogDefaults, TemplateDialogInstance} from "@juulsgaard/ngx-material";
import {RenderSourceDirective} from "@juulsgaard/ngx-tools";
import {FormDialogDirective} from "../../directives/dialog-form.directive";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {delay, of, switchMap} from "rxjs";

@Component({
  selector: 'ngx-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialogComponent<T extends Record<string, any>> implements OnDestroy {

  readonly showErrors = signal(false);

  readonly config: InputSignal<FormDialog<T>> = input.required<FormDialog<T>>();
  readonly formTemplate = contentChild(FormDialogDirective);
  readonly content = viewChild.required('content', {read: RenderSourceDirective});
  readonly footer = viewChild.required('footer', {read: RenderSourceDirective});
  readonly canClose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  private defaults = inject(NgxDialogDefaults);
  instance?: TemplateDialogInstance;

  constructor(private manager: DialogManagerService, private injector: Injector) {

    const show = computed(() => this.config().show());

    // Delay hiding the form to allow the dialog close animation to play first
    const showTemplate$ = toObservable(show).pipe(
      switchMap(show => show ? of(true) : of(false).pipe(delay(500)))
    );
    const showTemplate = toSignal(showTemplate$, {initialValue: false});

    effect(() => {
      const template = this.formTemplate();
      if (!template) return;
      template.show.set(showTemplate());
    }, {allowSignalWrites: true});

    effect(() => {
      const config = this.config();

      this.destroy();
      if (!config.show()) return;

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
