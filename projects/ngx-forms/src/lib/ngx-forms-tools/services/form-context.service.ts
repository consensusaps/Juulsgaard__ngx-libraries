import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export abstract class FormContext {

  protected _readonly$ = new BehaviorSubject(false);
  readonly$ = this._readonly$.asObservable();
  get readonly() {return this._readonly$.value}
}
