import {Observable} from "rxjs";

export interface OverlayOptions {
  canClose$: Observable<boolean>;
  scrollable$: Observable<boolean>;
  maxWidth$: Observable<number | undefined>;
}
