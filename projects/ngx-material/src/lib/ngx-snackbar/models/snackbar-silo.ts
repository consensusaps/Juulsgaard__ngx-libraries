import {Observable} from "rxjs";
import {cache, ObservableQueue} from "@juulsgaard/rxjs-tools";
import {SnackbarInstance} from "./snackbar-instance";
import {map} from "rxjs/operators";

export abstract class SnackbarSilo {

  abstract readonly disposed$: Observable<void>;
  private queue$ = new ObservableQueue<SnackbarInstance<unknown>>();
  readonly snackbars$: Observable<SnackbarInstance<unknown>[]>;

  readonly cssClass: string;

  protected addSnackbar(instance: SnackbarInstance<unknown>) {
    this.queue$.enqueue(instance);
    instance.dismiss$.subscribe(() => this.queue$.removeItem(instance));
  }

  protected constructor(options: SnackbarSiloOptions) {

    this.cssClass = options.cssClass;

    this.snackbars$ = this.queue$.items$.pipe(
      map(x => x.slice(0, 3)),
      cache()
    );
  }
}

export interface SnackbarSiloOptions {
  cssClass: string;
}
