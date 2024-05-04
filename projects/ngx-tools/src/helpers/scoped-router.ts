import {ActivatedRoute, NavigationEnd, NavigationExtras, Router} from "@angular/router";
import {assertInInjectionContext, DestroyRef, inject, Injector} from "@angular/core";
import {Observable, startWith} from "rxjs";
import {filter, map} from "rxjs/operators";
import {cache} from "@juulsgaard/rxjs-tools";
import {RouteState} from "./route-state";

/**
 * A router scoped to the current ActiveRoute.
 * Needs to be created in an injection scope.
 */
export class ScopedRouter extends RouteState {

  private _cachedRoute?: ActivatedRoute;

  private get parentRoute() {
    if (this._cachedRoute) return this._cachedRoute;
    if (this._depth > 0) return undefined;
    const route = this.getParentRoute(Math.abs(this._depth));
    this._cachedRoute = route;
    return route;
  }

  get routeOrDefault() {
    return this.parentRoute ?? this.getChildRouteOrDefault(this._depth);
  }

  get routeOrClosest() {
    return this.parentRoute ?? this.getChildRoute(this._depth);
  }

  route$: Observable<ActivatedRoute|undefined>;
  routeOrClosest$: Observable<ActivatedRoute>;

  /** @internal */
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    destroy: DestroyRef,
    private _depth: number,
  ) {
    super();

    if (_depth === 0) this._cachedRoute = this._route;

    this.init(this._router, destroy);

    this.route$ = this._router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map(() => this.route),
      startWith(this.route),
      cache()
    );

    this.routeOrClosest$ = this._router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map(() => this.routeOrClosest),
      startWith(this.routeOrClosest),
      cache()
    );
  }

  reset(options?: NavigationExtras) {
    return this.navigate(['.'], options);
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

  private getChildRouteOrDefault(depth: number) {

    let route = this._route;

    for (let i = 0; i < depth; i++) {
      if (!route.firstChild) return undefined;
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

interface ScopedRouterOptions {
  /** An injector for when using outside an injection context */
  injector?: Injector;
  /** Manually pass the route to use */
  route?: ActivatedRoute;
  /** Manually pass the router to use */
  router?: Router;
}
interface ScopedRouterOptionsExtended extends ScopedRouterOptions {
  /** The depth relative to the active route to use.
   Positive numbers for child routes, and negative for parent routes.*/
  depth?: number;
}

/**
 * Create a Scoped Router
 * @param depth - The depth relative to the active route to use.
 * Positive numbers for child routes, and negative for parent routes.
 * @param options - Optional settings for injection
 * @constructor
 */
export function scopedRouter(depth?: number, options?: ScopedRouterOptions): ScopedRouter;
/**
 * Create a Scoped Router
 * @param options - Options
 */
export function scopedRouter(options: ScopedRouterOptionsExtended): ScopedRouter;
export function scopedRouter(
  param?: number | ScopedRouterOptionsExtended,
  _options?: ScopedRouterOptions
): ScopedRouter {

  const options: ScopedRouterOptionsExtended|undefined = typeof param === 'number' ? _options : param;
  const injector = options?.injector;

  if (!injector) assertInInjectionContext(scopedRouter);

  const router = options?.router ?? injector?.get(Router) ?? inject(Router);
  const route = options?.route ?? injector?.get(ActivatedRoute) ?? inject(ActivatedRoute);
  const destroy = injector?.get(DestroyRef) ?? inject(DestroyRef);

  const depth = typeof param === 'number' ? param : options?.depth ?? 0;

  return new ScopedRouter(router, route, destroy, depth);
}

export function scopedRouterAttribute(
  injector: Injector,
  route?: ActivatedRoute|null
): (nav: boolean|''|number|ActivatedRoute|ScopedRouter|undefined|null) => ScopedRouter|undefined {
  return (nav: boolean|''|number|ActivatedRoute|ScopedRouter|undefined|null) => {
    if (nav === '' || nav === true) {
      if (route === null) return undefined;
      return scopedRouter({route, injector});
    }

    if (typeof nav === 'number') {
      if (route === null) return undefined;
      return scopedRouter(nav, {route: route, injector})
    }

    if (nav == null || nav === false) return undefined;
    if (nav instanceof ScopedRouter) return nav;
    return scopedRouter({route: nav, injector});
  }
}
