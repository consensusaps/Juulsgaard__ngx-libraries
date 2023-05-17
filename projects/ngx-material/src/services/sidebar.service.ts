import {BehaviorSubject} from "rxjs";
import {Provider, Type} from "@angular/core";

export class SidebarService {

  public static Provide(service?: Type<SidebarService>): Provider {
    if (!service) return {provide: SidebarService};
    return {provide: SidebarService, useClass: service};
  }

  private _show$ = new BehaviorSubject(false);
  show$ = this._show$.asObservable();

  get show() {return this._show$.value}
  set show(show: boolean) {this._show$.next(show)}

  toggle(show?: boolean) {
    if (this.show) {
      if (show === true) return;
      this.show = false;
      return;
    }

    if (show === false) return;
    this.show = true;
  }

}
