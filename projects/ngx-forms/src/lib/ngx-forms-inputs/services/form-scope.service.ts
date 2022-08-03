import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class FormScopeService {

  readonly$ = new BehaviorSubject(false);
}
