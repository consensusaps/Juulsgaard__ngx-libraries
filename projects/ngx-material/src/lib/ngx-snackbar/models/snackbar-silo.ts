import {Observable, Subject} from "rxjs";
import {cache, ObservableQueue} from "@juulsgaard/rxjs-tools";
import {SnackbarInstance} from "./snackbar-instance";
import {map} from "rxjs/operators";

export abstract class SnackbarSilo {

  private queue$: ObservableQueue<SnackbarInstance<unknown>>;
  readonly snackbars$: Observable<SnackbarInstance<unknown>[]>;

  readonly type: string;

  protected addSnackbar(instance: SnackbarInstance<unknown>) {
    this.queue$.enqueue(instance);
    instance.dismiss$.subscribe(() => this.queue$.removeItem(instance));
  }

  protected constructor(options: SnackbarSiloOptions) {

    this.queue$ = new ObservableQueue({size: options.showNewest ? options.maxElements : undefined});

    // Store settings
    this.type = options.type;

    // Dispose outdated instances
    this.queue$.itemRemoved$.subscribe(x => x.item.dispose());

    // Build the observable containing rendered elements
    this.snackbars$ = this.queue$.items$.pipe(
      options.maxElements ? map(x => x.slice(0, options.maxElements)) : map(x => x),
      options.order === 'default' ? map(x => x) : map(x => x.reverse()),
      cache()
    );
  }

  private _disposed$ = new Subject<void>();
  readonly disposed$ = this._disposed$.asObservable();

  protected dispose() {
    if (this._disposed$.closed) return;
    this._disposed$.next();
    this._disposed$.complete();

    // Dispose queue and contents
    this.queue$.dispose();
    this.queue$.items.forEach(x => x.dispose());
  }
}

export interface SnackbarSiloOptions {
  type: string;
  maxElements: number|undefined;
  order: 'default'|'reverse';
  showNewest: boolean;
}
