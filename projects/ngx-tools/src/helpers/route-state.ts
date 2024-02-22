import {BehaviorSubject, Observable, startWith} from "rxjs";
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

  private readonly _params$ = new BehaviorSubject(emptyStringMap);
  readonly params$: Observable<ReadonlyMap<string, string>> = this._params$.asObservable();
  readonly paramsSignal: Signal<ReadonlyMap<string, string>> = subjectToSignal(this._params$);
  get params(): ReadonlyMap<string, string> {return this.paramsSignal()}

  private readonly _query$ = new BehaviorSubject<ParamMap>(emptyParamMap);
  readonly query$: Observable<ParamMap> = this._query$.asObservable();
  readonly querySignal: Signal<ParamMap> = subjectToSignal(this._query$);
  get query(): ParamMap {return this.querySignal()}

  private readonly _data$ = new BehaviorSubject(emptyDataMap);
  readonly data$: Observable<ReadonlyMap<string, unknown>> = this._data$.asObservable();
  readonly dataSignal: Signal<ReadonlyMap<string, unknown>> = subjectToSignal(this._data$);
  get data(): ReadonlyMap<string, unknown> {return this.dataSignal()}

  private readonly _url$ = new BehaviorSubject(emptyList);
  readonly url$: Observable<ReadonlyArray<string>> = this._url$.asObservable();
  readonly urlSignal: Signal<ReadonlyArray<string>> = subjectToSignal(this._url$);
  get url(): ReadonlyArray<string> {return this.urlSignal()}

  private readonly _subUrl$ = new BehaviorSubject(emptyList);
  readonly subUrl$: Observable<ReadonlyArray<string>> = this._subUrl$.asObservable();
  readonly subUrlSignal: Signal<ReadonlyArray<string>> = subjectToSignal(this._subUrl$);
  get subUrl(): ReadonlyArray<string> {return this.subUrlSignal()}

  abstract readonly route: ActivatedRoute|undefined;
  abstract readonly routeOrClosest: ActivatedRoute|undefined;

  /**
   * Start route monitoring.
   * Can only be run in constructor.
   * @protected
   */
  protected init(router: Router, destroy: DestroyRef) {
    // TODO: Lazy load this data
    router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      startWith(undefined),
      takeUntilDestroyed(destroy)
    ).subscribe(() => this.generateState());
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
    return computed(() => this.paramsSignal().get(key));
  }

  getQuery(key: string): Signal<string|null> {
    return computed(() => this.querySignal().get(key));
  }

  getQueryList(key: string): Signal<string[]> {
    return computed(() => this.querySignal().getAll(key));
  }

  getData<T = string>(key: string): Signal<T|undefined> {
    return computed(() => this.dataSignal().get(key) as T);
  }

  private generateState() {
    const baseRoute = this.route;

    if (!baseRoute) {
      this._url$.next(emptyList);
      this._subUrl$.next(emptyList);
      this._params$.next(emptyStringMap);
      this._data$.next(emptyDataMap);
      this._query$.next(this.routeOrClosest?.snapshot.queryParamMap ?? emptyParamMap);
      return;
    }

    const rootSnapshot = baseRoute.snapshot;
    const params = new Map<string, string>();
    const data = new Map<string, any>();
    const url: string[] = []
    const subUrl: string[] = []

    let route: ActivatedRouteSnapshot|null = rootSnapshot;

    while (route) {

      url.push(...route.url.map(x => x.path));
      if (route !== rootSnapshot) subUrl.push(...route.url.map(x => x.path));

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

    this._url$.next(url);
    this._subUrl$.next(subUrl);
    this._params$.next(params);
    this._data$.next(data);
    this._query$.next(rootSnapshot.queryParamMap);
  }
}
