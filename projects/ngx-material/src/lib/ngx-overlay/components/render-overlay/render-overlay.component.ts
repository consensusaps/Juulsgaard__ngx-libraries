import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, Inject, Injector, TemplateRef
} from '@angular/core';
import {Observable} from "rxjs";
import {OVERLAY_ANIMATE_IN, OVERLAY_CONTEXT, OVERLAY_Z_INDEX} from "../../models/overlay-tokens.models";
import {OverlayContext} from "../../models/overlay-context.models";
import {map} from "rxjs/operators";
import {overlayAnimation} from '@consensus-labs/ngx-tools'

@Component({
  templateUrl: './render-overlay.component.html',
  styleUrls: ['./render-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation(),
  ],
  host: {'[@overlay]': 'animate'}
})
export class RenderOverlayComponent implements DoCheck {

  template: TemplateRef<void>;
  onClose: () => any;
  canClose$: Observable<boolean>;
  scrollable$: Observable<boolean>;
  maxWidth$: Observable<string>;

  onChange?: () => any;

  constructor(
    element: ElementRef<HTMLElement>,
    @Inject(OVERLAY_CONTEXT) context: OverlayContext,
    @Inject(OVERLAY_Z_INDEX) zIndex: number|undefined,
    @Inject(OVERLAY_ANIMATE_IN) public animate: boolean,
    public injector: Injector,
    private changes: ChangeDetectorRef
  ) {
    this.changes.detach();
    element.nativeElement.style.zIndex = zIndex?.toFixed(0) ?? '';

    this.template = context.template;
    this.canClose$ = context.canClose$;
    this.onClose = context.onClose;
    this.scrollable$ = context.scrollable$;
    this.maxWidth$ = context.maxWidth$.pipe(
      map(x => x ?? 1600),
      map(x => `${x}px`)
    );

    this.onChange = context.onChange;
    context.changes$?.subscribe(() => this.changes.detectChanges());
  }

  ngDoCheck() {
    this.onChange?.();
  }
}
