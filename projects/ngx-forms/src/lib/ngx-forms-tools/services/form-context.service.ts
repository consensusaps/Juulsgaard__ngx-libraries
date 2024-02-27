import {Injectable, Signal} from '@angular/core';

@Injectable()
export abstract class FormContext {
  abstract readonly readonly: Signal<boolean>;
}
