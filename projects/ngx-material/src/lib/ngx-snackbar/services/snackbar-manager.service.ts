import {Injectable} from '@angular/core';
import {ObservableSet} from "@juulsgaard/rxjs-tools";
import {SnackbarSilo} from "../models/snackbar-silo";

@Injectable({providedIn: 'root'})
export class SnackbarManagerService {

  private _silos$ = new ObservableSet<SnackbarSilo>();
  readonly instructions$ = this._silos$.itemDelta$;

  register(silo: SnackbarSilo) {
    const added = this._silos$.add(silo);
    if (!added) return;
    silo.disposed$.subscribe(() => this._silos$.delete(silo));
  }
}
