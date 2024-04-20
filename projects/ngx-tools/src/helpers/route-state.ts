import {BehaviorSubject, Observable, startWith, withLatestFrom} from "rxjs";
import {subjectToSignal} from "./signals";
import {
  ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, NavigationEnd, ParamMap, Router
} from "@angular/router";
import {computed, DestroyRef, Signal} from "@angular/core";
import {distinctUntilChanged, filter, map} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {cache} from "@juulsgaard/rxjs-tools";

const emptyParamMap = convertToParamMap({});
const emptyStringMap: ReadonlyMap<string, string> = new Map<string, string>;
const emptyDataMap: ReadonlyMap<string, unknown> = new Map<string, unknown>;
const emptyList: ReadonlyArray<string> = [];

export abstract class RouteState {

  private readonly _snapshotOrDefault$ = new BehaviorSubject<ActivatedRouteSnapshot|undefined>(undefined);
  readonly snapshotOrDefault$ = this._snapshotOrDefault$.pipe(distinctUntilChanged());
  readonly snapshotOrDefault = subjectToSignal(this._snapshotOrDefault$);

  private readonly _closestSnapshot$ = new BehaviorSubject<ActivatedRouteSnapshot|undefined>(undefined);
  readonly closestSnapshot$ = this._closestSnapshot$.pipe(distinctUntilChanged());
  readonly closestSnapshot = subjectToSignal(this._closestSnapshot$);

  readonly snapshot$ = this.closestSnapshot$;
  readonly snapshot = this.closestSnapshot;

  //<editor-fold desc="params">
  readonly params$: Observable<ReadonlyMap<string, string>> = this.snapshotOrDefault$.pipe(
    map(snapshot => this.mapParams(snapshot)),
    distinctUntilChanged(),
    cache()
  );
  readonly params: Signal<ReadonlyMap<string, string>> = computed(() => this.mapParams(this.snapshotOrDefault()));

  private mapParams(snapshot: ActivatedRouteSnapshot|undefined) {
    if (!snapshot) return emptyStringMap;
    const params = new Map<string, string>();
    forEachRoute(snapshot, route => {
      for (let name in route.params) {
        const val = route.params[name];
        if (val == null) continue;
        params.set(name, val);
      }
    });
    return params;
  }
  //</editor-fold>

  //<editor-fold desc="Query">
  readonly query$: Observable<ParamMap> = this.snapshotOrDefault$.pipe(
    withLatestFrom(this.closestSnapshot$),
    map(([snapshot, closest]) => snapshot?.queryParamMap ?? closest?.queryParamMap ?? emptyParamMap),
    distinctUntilChanged(),
    cache()
  );
  readonly query: Signal<ParamMap> = computed(
    () => this.snapshotOrDefault()?.queryParamMap ?? this.closestSnapshot()?.queryParamMap ?? emptyParamMap
  );
  //</editor-fold>

  //<editor-fold desc="Data">
  readonly data$: Observable<ReadonlyMap<string, unknown>> = this.snapshotOrDefault$.pipe(
    map(snapshot => this.mapData(snapshot)),
    distinctUntilChanged(),
    cache()
  );
  readonly data: Signal<ReadonlyMap<string, unknown>> = computed(() => this.mapData(this.snapshotOrDefault()));

  private mapData(snapshot: ActivatedRouteSnapshot|undefined) {
    if (!snapshot) return emptyDataMap;
    const data = new Map<string, any>();
    forEachRoute(snapshot, route => {
      for (let name in route.data) {
        data.set(name, route.data[name]);
      }
    });
    return data;
  }
  //</editor-fold>

  //<editor-fold desc="Url">
  readonly url$: Observable<ReadonlyArray<string>> = this.snapshotOrDefault$.pipe(
    map(snapshot => this.mapUrl(snapshot)),
    distinctUntilChanged(),
    cache()
  );
  readonly url: Signal<ReadonlyArray<string>> = computed(() => this.mapUrl(this.snapshotOrDefault()));

  readonly subUrl$: Observable<ReadonlyArray<string>> = this.snapshotOrDefault$.pipe(
    map(snapshot => this.mapUrl(snapshot?.firstChild)),
    distinctUntilChanged(),
    cache()
  );
  readonly subUrl: Signal<ReadonlyArray<string>> = computed(() => this.mapUrl(this.snapshotOrDefault()?.firstChild));

  private mapUrl(snapshot: ActivatedRouteSnapshot|undefined|null) {
    if (!snapshot) return emptyList;
    const url: string[] = [];
    forEachRoute(snapshot, route => {
      url.push(...route.url.map(x => x.path));
    });
    return url;
  }
  //</editor-fold>

  get route(): ActivatedRoute {return this.routeOrClosest};
  abstract readonly routeOrClosest: ActivatedRoute;
  abstract readonly routeOrDefault: ActivatedRoute|undefined;

  /**
   * Start route monitoring.
   * Can only be run in constructor.
   * @protected
   */
  protected init(router: Router, destroy: DestroyRef) {
    router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      startWith(undefined),
      takeUntilDestroyed(destroy)
    ).subscribe(() => {
      this._snapshotOrDefault$.next(this.routeOrDefault?.snapshot);
      this._closestSnapshot$.next(this.routeOrClosest?.snapshot);
    });
  }

  protected emitSnapshots(orDefault: ActivatedRouteSnapshot, closest: ActivatedRouteSnapshot) {
    this._snapshotOrDefault$.next(orDefault);
    this._closestSnapshot$.next(closest);
  }

  getParam$(key: string): Observable<string|undefined> {
    return this.params$.pipe(map(x => x.get(key)), distinctUntilChanged(), cache());
  }

  getQuery$(key: string): Observable<string|null> {
    return this.query$.pipe(map(x => x.get(key)), distinctUntilChanged(), cache());
  }

  getQueryList$(key: string): Observable<string[]> {
    return this.query$.pipe(map(x => x.getAll(key)), distinctUntilChanged(), cache());
  }

  getData$<T = string>(key: string): Observable<T|undefined> {
    return this.data$.pipe(map(x => x.get(key) as T), distinctUntilChanged(), cache());
  }

  getParam(key: string): Signal<string|undefined> {
    return computed(() => this.params().get(key));
  }

  getQuery(key: string): Signal<string|null> {
    return computed(() => this.query().get(key));
  }

  getQueryList(key: string): Signal<string[]> {
    return computed(() => this.query().getAll(key));
  }

  getData<T = string>(key: string): Signal<T|undefined> {
    return computed(() => this.data().get(key) as T);
  }
}

function forEachRoute(baseRoute: ActivatedRouteSnapshot, callback: (route: ActivatedRouteSnapshot) => void) {
  let route: ActivatedRouteSnapshot|null = baseRoute;
  while (route) {
    callback(route);
    route = route.firstChild;
  }
}
