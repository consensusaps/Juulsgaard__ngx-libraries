import {Observable} from "rxjs";
import {TemplateRendering} from "@consensus-labs/ngx-tools";
import {OverlayOptions} from "./overlay-options";


export abstract class OverlayContext implements OverlayOptions {

  canClose$: Observable<boolean>;
  maxWidth$: Observable<number | undefined>;
  scrollable$: Observable<boolean>;

  abstract content: TemplateRendering;

  protected constructor(options: OverlayOptions, public zIndex: number) {
    this.canClose$ = options.canClose$;
    this.maxWidth$ = options.maxWidth$;
    this.scrollable$ = options.scrollable$;
  }

  abstract close(): void;
}

