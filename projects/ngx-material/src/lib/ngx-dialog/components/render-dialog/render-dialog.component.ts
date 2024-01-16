import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';
import {EMPTY, Observable, of, pairwise, startWith} from "rxjs";
import {DIALOG_ANIMATE_IN, DIALOG_CONTEXT} from "../../models/dialog-tokens";
import {overlayAnimation, TemplateRendering} from '@juulsgaard/ngx-tools'
import {StaticDialogButton, StaticDialogContext} from "../../models/static-dialog-context";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
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

  header$: Observable<string>;
  canClose = false;

  contentTemplate$: Observable<TemplateRendering> = EMPTY;
  footerTemplate$: Observable<TemplateRendering|undefined> = EMPTY;

  htmlDescription?: string;
  plainDescription?: string;
  buttons?: StaticDialogButton[];

  private context = inject(DIALOG_CONTEXT);
  public animate = inject(DIALOG_ANIMATE_IN);
  private element = inject(ElementRef<HTMLElement>).nativeElement;

  constructor() {

    this.element.style.zIndex = this.context.zIndex?.toFixed(0) ?? '';

    if (this.context instanceof StaticDialogContext) {
      this.header$ = of(this.context.header);

      this.canClose = this.context.canClose;
      this.element.classList.toggle('closable', this.context.canClose);
      this.element.classList.toggle('scrollable', this.context.scrollable);
      this.element.classList.add(this.context.type);
      this.element.classList.add(...this.context.styles);

      this.plainDescription = this.context.isHtml ? undefined : this.context.description;
      this.htmlDescription = this.context.isHtml ? this.context.description : undefined;
      this.buttons = this.context.buttons;
      return;
    }

    this.header$ = this.context.header$;
    this.contentTemplate$ = this.context.content$;
    this.footerTemplate$ = this.context.footer$;

    this.context.canClose$.pipe(
      takeUntilDestroyed()
    ).subscribe(canClose => {
      this.canClose = canClose;
      this.element.classList.toggle('closable', canClose)
    });

    this.context.scrollable$.pipe(
      takeUntilDestroyed()
    ).subscribe(canScroll => this.element.classList.toggle('scrollable', canScroll));

    this.context.type$.pipe(
      takeUntilDestroyed(),
      startWith(undefined),
      pairwise()
    ).subscribe(([prev, next]) => {
      if (prev === next) return;
      if (prev) this.element.classList.remove(prev);
      if (next) this.element.classList.add(next);
    });

    this.context.styles$.pipe(
      takeUntilDestroyed(),
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
}

