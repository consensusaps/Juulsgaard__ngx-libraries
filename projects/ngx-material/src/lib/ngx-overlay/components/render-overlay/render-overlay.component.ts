import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';
import {overlayAnimation, TemplateRendering} from '@juulsgaard/ngx-tools'
import {OverlayContext} from "../../models/overlay-context";
import {OVERLAY_ANIMATE_IN} from "../../models/overlay-tokens";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
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

  content: TemplateRendering;
  animate = inject(OVERLAY_ANIMATE_IN);

  private canClose = false;
  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private context = inject(OverlayContext);

  constructor() {

    this.element.style.zIndex = this.context.zIndex?.toFixed(0) ?? '';

    this.content = this.context.content;

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
