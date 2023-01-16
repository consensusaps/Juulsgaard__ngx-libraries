import {ChangeDetectionStrategy, Component, ElementRef, Inject, Injector, TemplateRef} from '@angular/core';
import {Observable, of} from "rxjs";
import {DialogContext, StaticDialogButton} from "../../models/dialog-context.models";
import {DIALOG_CONTEXT, DIALOG_Z_INDEX} from "../../models/dialog-tokens.models";
import {overlayAnimation} from '@consensus-labs/ngx-tools'

@Component({
  templateUrl: './render-dialog.component.html',
  styleUrls: ['./render-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation(),
  ],
  host: {'[@overlay]': 'true'}
})
export class RenderDialogComponent {

  onClose?: () => any;

  header$: Observable<string>;
  scrollable$: Observable<boolean>;

  contentTemplate$?: Observable<TemplateRef<void>>;
  footerTemplate$?: Observable<TemplateRef<void>|undefined>;

  htmlDescription?: string;
  plainDescription?: string;
  buttons?: StaticDialogButton[];

  constructor(
    element: ElementRef<HTMLElement>,
    @Inject(DIALOG_CONTEXT) context: DialogContext,
    @Inject(DIALOG_Z_INDEX) zIndex: number|undefined,
    public injector: Injector
  ) {

    element.nativeElement.style.zIndex = zIndex?.toFixed(0) ?? '';
    this.onClose = context.onClose;

    if ('buttons' in context) {
      this.header$ = of(context.header);
      this.scrollable$ = of(context.withScroll);
      this.plainDescription = context.isHtml ? undefined : context.description;
      this.htmlDescription = context.isHtml ? context.description : undefined;
      this.buttons = context.buttons;
      return;
    }

    this.header$ = context.header$;
    this.scrollable$ = context.withScroll$;
    this.contentTemplate$ = context.content$;
    this.footerTemplate$ = context.footer$;
  }

}

