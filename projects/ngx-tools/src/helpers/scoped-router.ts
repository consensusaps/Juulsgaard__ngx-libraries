import {ActivatedRoute, NavigationEnd, NavigationExtras, Router} from "@angular/router";
import {inject} from "@angular/core";
import {Observable, startWith} from "rxjs";
import {filter, map} from "rxjs/operators";
import {cache} from "@juulsgaard/rxjs-tools";
import {RouteState} from "./route-state";

/**
 * A router scoped to the current ActiveRoute.
 * Needs to be created in an injection scope.
 */
export class ScopedRouter extends RouteState {

  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private _cachedRoute?: ActivatedRoute;
  get route() {

    if (this._cachedRoute) return this._cachedRoute;

    if (this.depth >= 0) return this.getChildRoute(this.depth);

    const route = this.getParentRoute(Math.abs(this.depth));
    this._cachedRoute = route;
    return route;
  }

  route$: Observable<ActivatedRoute>;

  /**
   * @param depth - Target a relative scope. positive numbers for child routes, and negative for parent routes
   */
  constructor(private depth = 0) {
    super();
    if (depth === 0) this._cachedRoute = this._route;
    this.init(this._router);

    this.route$ = this._router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map(() => this.route),
      startWith(this.route),
      cache()
    );
  }

  reset() {
    return this.navigate(['.']);
  }

  navigate(route: string[], options?: NavigationExtras) {
    options ??= {};
    options.relativeTo = this.route;
    return this._router.navigate(route, options);
  }

  //<editor-fold desc="Util">
  private getChildRoute(depth: number) {

    let route = this._route;

    for (let i = 0; i < depth; i++) {
      if (!route.firstChild) return route;
      route = route.firstChild;
    }

    return route;
  }

  private getParentRoute(depth: number) {
    let route = this._route;

    for (let i = 0; i < depth; i++) {
      if (!route.parent) return route;
      route = route.parent;
    }

    return route;
  }
  //</editor-fold>
}
