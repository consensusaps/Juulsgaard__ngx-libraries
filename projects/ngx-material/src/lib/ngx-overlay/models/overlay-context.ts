import {TemplateRendering} from "@juulsgaard/ngx-tools";
import {OverlayOptions} from "./overlay-options";
import {Signal} from "@angular/core";


export abstract class OverlayContext implements OverlayOptions {

  canClose: Signal<boolean>;
  scrollable: Signal<boolean>;
  styles: Signal<string[]>;
  type: Signal<string>;

  abstract content: TemplateRendering;

  protected constructor(options: OverlayOptions, public zIndex: number) {
    this.canClose = options.canClose;
    this.scrollable = options.scrollable;
    this.styles = options.styles;
    this.type = options.type;
  }

  abstract close(): void;
}

