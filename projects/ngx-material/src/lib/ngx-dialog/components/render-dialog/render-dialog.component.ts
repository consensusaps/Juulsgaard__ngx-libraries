import {ChangeDetectionStrategy, Component, ElementRef, Inject} from '@angular/core';
import {Observable, of} from "rxjs";
import {DialogContext} from "../../models/dialog-context";
import {DIALOG_ANIMATE_IN, DIALOG_CONTEXT} from "../../models/dialog-tokens";
import {overlayAnimation, TemplateRendering} from '@consensus-labs/ngx-tools'
import {StaticDialogButton, StaticDialogContext} from "../../models/static-dialog-context";

@Component({
  templateUrl: './render-dialog.component.html',
  styleUrls: ['./render-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation(),
  ],
  host: {'[@overlay]': 'animate', '[class.ngx-dialog]': 'true'}
})
export class RenderDialogComponent {

  header$: Observable<string>;
  scrollable$: Observable<boolean>;

  contentTemplate$?: Observable<TemplateRendering>;
  footerTemplate$?: Observable<TemplateRendering|undefined>;

  htmlDescription?: string;
  plainDescription?: string;
  buttons?: StaticDialogButton[];

  constructor(
    element: ElementRef<HTMLElement>,
    @Inject(DIALOG_CONTEXT) private context: DialogContext,
    @Inject(DIALOG_ANIMATE_IN) public animate: boolean
  ) {

    element.nativeElement.style.zIndex = context.zIndex?.toFixed(0) ?? '';

    if (context instanceof StaticDialogContext) {
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

  onClose() {
    this.context.close();
  }

}

