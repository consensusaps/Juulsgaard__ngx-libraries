import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, startWith, Subscription} from "rxjs";
import {ActivatedRouteSnapshot, NavigationEnd, ParamMap, Router} from "@angular/router";
import {cache} from "@consensus-labs/rxjs-tools";
import {distinctUntilChanged, filter, map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class RouteService {

  private sub: Subscription;

  private _params$ = new BehaviorSubject(new Map<string, string>());
  public readonly params$ = this._params$.asObservable();
  get params() {return this._params$.value}

  private _query$ = new BehaviorSubject<ParamMap|undefined>(undefined);
  public readonly queryOrDefault$ = this._query$.asObservable();
  public readonly query$ = this._query$.pipe(
    filter((x): x is ParamMap => !!x)
  );
  get query() {return this._query$.value}

  private _data$ = new BehaviorSubject(new Map<string, any>());
  public readonly data$ = this._data$.asObservable();
  get data() {return this._data$.value}

  constructor(private router: Router) {
    this.sub = this.router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      startWith(undefined)
    ).subscribe(() => {
      this.generateState(this.router.routerState.root.snapshot);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getParam$(key: string): Observable<string|undefined> {
    return this.params$.pipe(map(x => x.get(key)), distinctUntilChanged(), cache());
  }

  getData$<T = any>(key: string): Observable<T|undefined> {
    return this.data$.pipe(map(x => x.get(key)), distinctUntilChanged(), cache());
  }

  private generateState(rootSnapshot: ActivatedRouteSnapshot) {
    const params = new Map<string, string>();
    const data = new Map<string, any>();

    let route: ActivatedRouteSnapshot|null = rootSnapshot;

    while (route) {

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

    this._params$.next(params);
    this._data$.next(data);
    this._query$.next(rootSnapshot.queryParamMap);
  }
}
