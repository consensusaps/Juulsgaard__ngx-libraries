import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, effect, EventEmitter, inject, Injector,
  input, InputSignal, InputSignalWithTransform, model, ModelSignal, OnDestroy, Output, viewChild
} from '@angular/core';
import {DialogManagerService} from "../../services/dialog-manager.service";
import {DialogFooterTemplateDirective} from "../../directives/dialog-footer-template.directive";
import {DialogContentTemplateDirective} from "../../directives/dialog-content-template.directive";
import {Subscription} from "rxjs";
import {TemplateDialogInstance} from "../../models/template-dialog-context";
import {RenderSourceDirective} from "@juulsgaard/ngx-tools";
import {NgxDialogDefaults} from "../../models/dialog-defaults";
import {arrToSet, setToArr} from "@juulsgaard/ts-tools";


@Component({
  selector: 'ngx-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnDestroy {

  private defaults = inject(NgxDialogDefaults);
  private injector = inject(Injector);
  private manager = inject(DialogManagerService);

  private contentTemplate = contentChild(DialogContentTemplateDirective);
  private footerTemplate = contentChild(DialogFooterTemplateDirective);

  private content = viewChild.required('content', {read: RenderSourceDirective});
  private footer = viewChild.required('footer', {read: RenderSourceDirective});

  readonly header: InputSignal<string | undefined> = input<string>();
  readonly scrollable: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly type: InputSignal<string | undefined> = input<string>();
  readonly styles: InputSignalWithTransform<string[], string[] | string | undefined> = input(
    [] as string[],
    {
      transform: (styles: string[]|string|undefined) => Array.isArray(styles) ? styles : styles ? [styles] : []
    }
  );

  readonly show: ModelSignal<boolean> = model(true);

  readonly disableClose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly canClose = computed(() => !this.disableClose());
  @Output() close = new EventEmitter<void>();

  private instance?: TemplateDialogInstance;
  private instanceSub?: Subscription;

  constructor() {
    effect(() => this.toggleDialog(this.show()));
  }

  private toggleDialog(show: boolean) {
    if (this.instance) {
      this.manager.closeDialog(this.instance);
      this.instanceSub?.unsubscribe();
    }

    if (!show) return;

    this.instance = this.manager.createDialog(
      {
        content: computed(() => this.contentTemplate() ?? this.content()),
        footer: computed(() => this.footerTemplate() ?? this.footer()),
        header: this.header,
        scrollable: this.scrollable,
        canClose: this.canClose,
        type: computed(() => this.type() ?? this.defaults.type),
        styles: computed(() => setToArr(arrToSet([...this.styles(), ...this.defaults.styles]))),
      },
      this.injector
    );

    this.instanceSub = this.instance.close$.subscribe(() => {
      this.close.emit();
      this.show.set(false);
    });
  }

  ngOnDestroy() {
    this.instanceSub?.unsubscribe();
    if (!this.instance) return;
    this.manager.closeDialog(this.instance);
  }
}
