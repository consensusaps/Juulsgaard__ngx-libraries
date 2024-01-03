import {Observable} from "rxjs";

export interface OverlayOptions {
  canClose$: Observable<boolean>;
  scrollable$: Observable<boolean>;
  styles$: Observable<string[]>;
  type$: Observable<string>;
}
