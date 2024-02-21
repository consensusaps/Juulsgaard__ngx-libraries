import {ChangeDetectionStrategy, Component, effect, ElementRef, inject} from '@angular/core';
import {overlayAnimation, TemplateRendering} from '@juulsgaard/ngx-tools'
import {OverlayContext} from "../../models/overlay-context";
import {OVERLAY_ANIMATE_IN} from "../../models/overlay-tokens";
import {toObservable} from "@angular/core/rxjs-interop";
import {pairwise, startWith} from "rxjs";
import {arrToSet} from "@juulsgaard/ts-tools";

@Component({
  templateUrl: './render-overlay.component.html',
  styleUrls: ['./render-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation(),
  ],
  host: {'[@overlay]': 'animate', '[class.ngx-overlay]': 'true'},
  selector: 'ngx-overlay'
})
export class RenderOverlayComponent {

  readonly content: TemplateRendering;
  animate = inject(OVERLAY_ANIMATE_IN);

  private canClose = false;
  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private context = inject(OverlayContext);

  constructor() {

    this.element.style.zIndex = this.context.zIndex?.toFixed(0) ?? '';

    this.content = this.context.content;

    effect(() => {
      this.canClose = this.context.canClose();
      this.element.classList.toggle('closable', this.canClose)
    });

    effect(() => {
      this.element.classList.toggle('scrollable', this.context.scrollable());
    });

    toObservable(this.context.type).pipe(
      startWith(undefined),
      pairwise()
    ).subscribe(([prev, next]) => {
      if (prev === next) return;
      if (prev) this.element.classList.remove(prev);
      if (next) this.element.classList.add(next);
    });

    toObservable(this.context.styles).pipe(
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
