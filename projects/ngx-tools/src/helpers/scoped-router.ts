import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationExtras, Router} from "@angular/router";
import {inject} from "@angular/core";
import {Observable, startWith} from "rxjs";
import {filter, map} from "rxjs/operators";
import {cache} from "@juulsgaard/rxjs-tools";
import {objToMap} from "@juulsgaard/ts-tools";

/**
 * A router scoped to the current ActiveRoute.
 * Needs to be created in an injection scope.
 */
export class ScopedRouter {

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

  route$: Observable<ActivatedRouteSnapshot>;
  routeData$: Observable<RouteInformation>;

  /**
   * @param depth - Target a relative scope. positive numbers for child routes, and negative for parent routes
   */
  constructor(private depth = 0) {
    if (depth === 0) this._cachedRoute = this._route;

    const navEvents$ = this._router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      startWith(undefined),
      cache()
    );

    this.route$ = navEvents$.pipe(
      map(() => this.route.snapshot),
      cache()
    );

    this.routeData$ = navEvents$.pipe(
      map(() => this.generateNavEvent()),
      cache()
    );
  }

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

  reset() {
    return this.navigate(['.']);
  }

  navigate(route: string[], options?: NavigationExtras) {
    options ??= {};
    options.relativeTo = this.route;
    return this._router.navigate(route, options);
  }

  private generateNavEvent(): RouteInformation {
    const params = new Map<string, string>();
    const data = new Map<string, any>();
    const url: string[] = []

    const baseRoute = this.route.snapshot;
    let route: ActivatedRouteSnapshot|null = baseRoute;

    while (route) {

      url.push(...route.url.map(x => x.path));

      for (let name in route.params) {
        const val = route.params[name];
        if (val == null) continue;
        params.set(name, val);
      }

      for (let name in route.data) {
        data.set(name, route.data[name]);
      }

      route = route.firstChild;
    }

    return {
      route: baseRoute,
      url,
      data,
      params,
      query: objToMap(baseRoute.queryParams, (_, k) => k, x => x)
    }
  }
}

interface RouteInformation {
  route: ActivatedRouteSnapshot;
  url: string[];
  data: Map<string, any>;
  params: Map<string, any>;
  query: Map<string|number, any>;
}
