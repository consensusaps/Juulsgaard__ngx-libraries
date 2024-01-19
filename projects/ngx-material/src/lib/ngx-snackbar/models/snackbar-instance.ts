import {SnackbarContext} from "./snackbar-context";
import {Disposable} from "@juulsgaard/ts-tools";
import {Subject, takeUntil, timer} from "rxjs";
import {Injector, Type, ViewContainerRef} from "@angular/core";
import {SnackbarOptions} from "./snackbar-options";
import {SnackbarBaseComponent} from "../components/snackbar-base.component";

export class SnackbarInstance<T> extends SnackbarContext<T> implements Disposable {

  private _dismiss$ = new Subject<void>();
  readonly dismiss$ = this._dismiss$.asObservable();

  private _disposed$ = new Subject<void>();
  readonly disposed$ = this._disposed$.asObservable();

  override dismiss(): void {
    this._dismiss$.next();
  }

  dispose() {
    if (this._disposed$.closed) return;
    this._disposed$.next();
    this._disposed$.complete();
    this._dismiss$.complete();
  }

  render(viewContainer: ViewContainerRef, index: number) {

    const parentInjector = this.injector ?? viewContainer.injector;
    const injector = Injector.create({
      parent: parentInjector,
      providers: [
        {provide: SnackbarContext, useValue: this}
      ],
      name: 'Snackbar Injector'
    });
    return  viewContainer.createComponent(this.component, {injector, index});
  }

  constructor(
    readonly component: Type<SnackbarBaseComponent<T>>,
    options: SnackbarOptions<T>,
    private injector?: Injector
  ) {
    super(options);

    if (this.duration !== undefined) {
      timer(this.duration).pipe(
        takeUntil(this.disposed$)
      ).subscribe(() => this.dismiss());
    }
  }

}
