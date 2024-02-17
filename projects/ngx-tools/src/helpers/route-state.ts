import {BehaviorSubject, Observable, startWith} from "rxjs";
import {subjectToSignal} from "./signals";
import {
  ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, NavigationEnd, ParamMap, Router
} from "@angular/router";
import {computed, Signal} from "@angular/core";
import {distinctUntilChanged, filter, map} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {cache} from "@juulsgaard/rxjs-tools";

const emptyParamMap = convertToParamMap({});

export abstract class RouteState {

  private _params$ = new BehaviorSubject(new Map<string, string>());
  public readonly params$ = this._params$.asObservable();
  paramsSignal = subjectToSignal(this._params$);
  get params() {return this.paramsSignal()}

  private _query$ = new BehaviorSubject<ParamMap>(emptyParamMap);
  public readonly query$ = this._query$.asObservable();
  querySignal = subjectToSignal(this._query$);
  get query() {return this.querySignal()}

  private _data$ = new BehaviorSubject(new Map<string, any>());
  public readonly data$ = this._data$.asObservable();
  dataSignal = subjectToSignal(this._data$);
  get data() {return this.dataSignal()}

  private _url$ = new BehaviorSubject<string[]>([]);
  public readonly url$ = this._url$.asObservable();
  urlSignal = subjectToSignal(this._url$);
  get url() {return this.urlSignal()}

  abstract readonly route: ActivatedRoute|undefined;

  /**
   * Start route monitoring.
   * Can only be run in constructor.
   * @protected
   */
  protected init(router: Router) {
    router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      startWith(undefined),
      takeUntilDestroyed()
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
    return this.data$.pipe(map(x => x.get(key)), distinctUntilChanged(), cache());
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
    return computed(() => this.dataSignal().get(key));
  }

  private generateState() {
    const baseRoute = this.route;
    if (!baseRoute) return;
    const rootSnapshot = baseRoute.snapshot;
    const params = new Map<string, string>();
    const data = new Map<string, any>();
    const url: string[] = []

    let route: ActivatedRouteSnapshot|null = rootSnapshot;

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

    this._url$.next(url);
    this._params$.next(params);
    this._data$.next(data);
    this._query$.next(rootSnapshot.queryParamMap);
  }
}
