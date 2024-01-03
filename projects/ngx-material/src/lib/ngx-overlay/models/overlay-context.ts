import {Observable} from "rxjs";
import {TemplateRendering} from "@juulsgaard/ngx-tools";
import {OverlayOptions} from "./overlay-options";


export abstract class OverlayContext implements OverlayOptions {

  canClose$: Observable<boolean>;
  scrollable$: Observable<boolean>;
  styles$: Observable<string[]>;
  type$: Observable<string>;

  abstract content: TemplateRendering;

  protected constructor(options: OverlayOptions, public zIndex: number) {
    this.canClose$ = options.canClose$;
    this.scrollable$ = options.scrollable$;
    this.styles$ = options.styles$;
    this.type$ = options.type$;
  }

  abstract close(): void;
}

