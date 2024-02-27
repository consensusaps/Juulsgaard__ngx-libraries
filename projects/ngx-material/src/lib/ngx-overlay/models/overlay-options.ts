import {Signal} from "@angular/core";

export interface OverlayOptions {
  canClose: Signal<boolean>;
  scrollable: Signal<boolean>;
  styles: Signal<string[]>;
  type: Signal<string>;
}
