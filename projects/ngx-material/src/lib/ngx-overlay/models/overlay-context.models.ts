import {Injector, TemplateRef} from "@angular/core";
import {Observable} from "rxjs";


export interface OverlayContext {
  template: TemplateRef<void>;
  onClose: () => any;
  canClose$: Observable<boolean>;
  scrollable$: Observable<boolean>;
  maxWidth$: Observable<number|undefined>;
  injector?: Injector;
  changes$?: Observable<void>;
  onChange?: () => any;
}
