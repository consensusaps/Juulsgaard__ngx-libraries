import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';
import {Observable, of} from "rxjs";
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

  private context = inject(DIALOG_CONTEXT);
  animate = inject(DIALOG_ANIMATE_IN);

  constructor(
    element: ElementRef<HTMLElement>
  ) {

    element.nativeElement.style.zIndex = this.context.zIndex?.toFixed(0) ?? '';

    if (this.context instanceof StaticDialogContext) {
      this.header$ = of(this.context.header);
      this.scrollable$ = of(this.context.withScroll);
      this.plainDescription = this.context.isHtml ? undefined : this.context.description;
      this.htmlDescription = this.context.isHtml ? this.context.description : undefined;
      this.buttons = this.context.buttons;
      return;
    }

    this.header$ = this.context.header$;
    this.scrollable$ = this.context.withScroll$;
    this.contentTemplate$ = this.context.content$;
    this.footerTemplate$ = this.context.footer$;
  }

  onClose() {
    this.context.close();
  }

}

