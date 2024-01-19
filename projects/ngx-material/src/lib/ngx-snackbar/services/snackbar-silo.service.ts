import {DestroyRef, inject, Injectable, Type} from '@angular/core';
import {SnackbarSilo, SnackbarSiloOptions} from "../models/snackbar-silo";
import {SnackbarManagerService} from "./snackbar-manager.service";
import {SnackbarBaseComponent} from "../components/snackbar-base.component";
import {SnackbarInstance} from "../models/snackbar-instance";
import {SnackbarOptions} from "../models/snackbar-options";

@Injectable()
export abstract class SnackbarSiloService extends SnackbarSilo {

  private manager = inject(SnackbarManagerService);

  protected constructor(options: SnackbarSiloOptions) {
    super(options);

    this.manager.register(this);
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  protected createSnackbar<T>(type: Type<SnackbarBaseComponent<T>>, options: SnackbarOptions<T>) {
    this.addSnackbar(new SnackbarInstance<T>(type, options))
  }
}
