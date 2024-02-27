import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, Signal} from '@angular/core';
import {pairwise, startWith} from "rxjs";
import {DIALOG_ANIMATE_IN, DIALOG_CONTEXT} from "../../models/dialog-tokens";
import {overlayAnimation, TemplateRendering} from '@juulsgaard/ngx-tools'
import {StaticDialogButton, StaticDialogContext} from "../../models/static-dialog-context";
import {toObservable} from "@angular/core/rxjs-interop";
import {arrToSet} from "@juulsgaard/ts-tools";

@Component({
  templateUrl: './render-dialog.component.html',
  styleUrls: ['./render-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation(),
  ],
  host: {'[@overlay]': 'animate', '[class.ngx-dialog]': 'true'},
  selector: 'ngx-dialog'
})
export class RenderDialogComponent {

  readonly header: Signal<string|undefined>;
  canClose = false;

  readonly contentTemplate: Signal<TemplateRendering|undefined>;
  readonly footerTemplate: Signal<TemplateRendering|undefined>;

  htmlDescription?: string;
  plainDescription?: string;
  buttons?: StaticDialogButton[];

  private context = inject(DIALOG_CONTEXT);
  public animate = inject(DIALOG_ANIMATE_IN);
  private element = inject(ElementRef<HTMLElement>).nativeElement;

  constructor() {

    this.element.style.zIndex = this.context.zIndex?.toFixed(0) ?? '';

    const context = this.context;

    if (context instanceof StaticDialogContext) {
      this.header = signal(context.header);
      this.contentTemplate = signal(undefined);
      this.footerTemplate = signal(undefined);

      this.canClose = context.canClose;
      this.element.classList.toggle('closable', context.canClose);
      this.element.classList.toggle('scrollable', context.scrollable);
      this.element.classList.add(context.type);
      this.element.classList.add(...context.styles);

      this.plainDescription = context.isHtml ? undefined : context.description;
      this.htmlDescription = context.isHtml ? context.description : undefined;
      this.buttons = context.buttons;
      return;
    }

    this.header = context.header;
    this.contentTemplate = context.content;
    this.footerTemplate = context.footer;

    effect(() => {
      this.canClose = context.canClose();
      this.element.classList.toggle('closable', this.canClose);
    });

    effect(() => {
      this.element.classList.toggle('scrollable', context.scrollable());
    });

    toObservable(context.type).pipe(
      startWith(undefined),
      pairwise(),
    ).subscribe(([prev, next]) => {
      if (prev === next) return;
      if (prev) this.element.classList.remove(prev);
      if (next) this.element.classList.add(next);
    });

    toObservable(context.styles).pipe(
      startWith([] as string[]),
      pairwise()
    ).subscribe(([prev, next]) => {
      const old = arrToSet(prev);
      for (let c of next) {
        this.element.classList.add(c);
        old.delete(c);
      }
      for (let c of old) {
        this.element.classList.remove(c);
      }
    });
  }

  onClose() {
    if (!this.canClose) return;
    this.context.close();
  }

  getFooters = (node: Node) => (node instanceof Element) && node.hasAttribute('dialogFooter');
  getNonFooters = (node: Node) => !this.getFooters(node);
}

