import {DestroyRef, inject, Injectable, Type} from '@angular/core';
import {SnackbarSilo, SnackbarSiloOptions} from "../models/snackbar-silo";
import {SnackbarManagerService} from "./snackbar-manager.service";
import {Subject} from "rxjs";
import {SnackbarBaseComponent} from "../models/snackbar-base.component";
import {SnackbarInstance} from "../models/snackbar-instance";
import {SnackbarOptions} from "../models/snackbar-options";

@Injectable()
export abstract class SnackbarSiloService extends SnackbarSilo {

  private manager = inject(SnackbarManagerService);

  protected constructor(options: SnackbarSiloOptions) {
    super(options);

    console.log(options, 'Register');
    this.manager.register(this);
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  private _disposed$ = new Subject<void>();
  readonly disposed$ = this._disposed$.asObservable();

  private dispose() {
    if (this._disposed$.closed) return;
    this._disposed$.next();
    this._disposed$.complete();
  }

  protected createSnackbar<T>(type: Type<SnackbarBaseComponent<T>>, options: SnackbarOptions<T>) {
    this.addSnackbar(new SnackbarInstance<T>(type, options))
  }
}
