import {ChangeDetectionStrategy, Component, ElementRef, Inject} from '@angular/core';
import {Observable} from "rxjs";
import {OVERLAY_ANIMATE_IN} from "../../models/overlay-tokens.models";
import {map} from "rxjs/operators";
import {overlayAnimation, TemplateRendering} from '@consensus-labs/ngx-tools'
import {OverlayContext} from "../../models/overlay-context.models";

@Component({
  templateUrl: './render-overlay.component.html',
  styleUrls: ['./render-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation(),
  ],
  host: {'[@overlay]': 'animate', '[class.ngx-overlay]': 'true'}
})
export class RenderOverlayComponent {

  content: TemplateRendering;
  canClose$: Observable<boolean>;
  scrollable$: Observable<boolean>;
  maxWidth$: Observable<string>;

  constructor(
    element: ElementRef<HTMLElement>,
    private context: OverlayContext,
    @Inject(OVERLAY_ANIMATE_IN) public animate: boolean
  ) {

    element.nativeElement.style.zIndex = context.zIndex?.toFixed(0) ?? '';

    this.content = context.content;

    this.canClose$ = context.canClose$;
    this.scrollable$ = context.scrollable$;
    this.maxWidth$ = context.maxWidth$.pipe(
      map(x => x ?? 1600),
      map(x => `${x}px`)
    );
  }

  onClose() {
    this.context.close();
  }
}
