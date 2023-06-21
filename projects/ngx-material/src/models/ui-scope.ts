import {inject, Injectable, InjectionToken, Provider} from '@angular/core';
import {auditTime, BehaviorSubject, combineLatestWith, Observable, of, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {cache, persistentCache, subscribed} from "@consensus-labs/rxjs-tools";

@Injectable()
export abstract class UIScopeContext {

  public static Provide(config: UIScopeConfig): Provider[] {
    return [
      {provide: UI_SCOPE_CONFIG, useValue: config},
      {provide: UIScopeContext, useClass: RootUIScopeContext}
    ];
  }

  readonly abstract hasHeader$: Observable<boolean>;
  readonly abstract hasHeader: boolean;
  readonly abstract hasChildren$: Observable<boolean>;
  readonly abstract hasChildren: boolean;
  readonly abstract hasWrapper$: Observable<boolean>;
  readonly abstract hasWrapper: boolean;

  readonly abstract wrapper$: Observable<WrapperData>;
  abstract registerWrapper$(): Observable<WrapperData>;
  abstract registerWrapper(apply: (wrapper: WrapperData) => void): Subscription;

  readonly abstract header$: Observable<HeaderData>;
  abstract registerHeader$(): Observable<HeaderData>;
  abstract registerHeader(apply: (wrapper: HeaderData) => void): Subscription;

  readonly abstract childScope$: Observable<UIScope>;
  readonly abstract passiveChildScope$: Observable<UIScope>;

  readonly abstract scope$: Observable<UIScope>;
}

export class BaseUIScopeContext extends UIScopeContext {

  //<editor-fold desc="Header">
  readonly header$: Observable<HeaderData>;
  private readonly _header$: Observable<HeaderData>;

  private readonly _hasHeader$ = new BehaviorSubject(false);
  readonly hasHeader$ = this._hasHeader$.asObservable();
  get hasHeader() {return this._hasHeader$.value}
  //</editor-fold>

  //<editor-fold desc="Wrapper">
  readonly wrapper$: Observable<WrapperData>;
  private readonly _wrapper$: Observable<WrapperData>;

  private readonly _hasWrapper$ = new BehaviorSubject(false);
  readonly hasWrapper$ = this._hasWrapper$.asObservable();
  get hasWrapper() {return this._hasWrapper$.value}
  //</editor-fold>

  //<editor-fold desc="Children">
  readonly childScope$: Observable<UIScope>;
  readonly passiveChildScope$: Observable<UIScope>;

  private readonly _hasChildren$ = new BehaviorSubject(false);
  readonly hasChildren$ = this._hasChildren$.asObservable();
  get hasChildren() {return this._hasChildren$.value}
  //</editor-fold>

  readonly scope$: Observable<UIScope>

  constructor(scope$: UIScopeContext);
  constructor(scope$: Observable<UIScope>, passiveScope$?: Observable<UIScope>);
  constructor(_scope$: Observable<UIScope>|UIScopeContext, _passiveScope$?: Observable<UIScope>) {
    super();

    this.scope$ = _scope$ instanceof UIScopeContext
      ? _scope$.childScope$
      : _scope$;

    const passiveScope$ = _scope$ instanceof UIScopeContext
      ? _scope$.passiveChildScope$
      : _passiveScope$ ?? _scope$;

    //<editor-fold desc="Children">
    this.passiveChildScope$ = passiveScope$.pipe(
      combineLatestWith(this.hasHeader$),
      map(([scope, hasHeader]) => hasHeader ? scope.child ?? scope : scope),
      cache()
    );

    this.childScope$ = this.scope$.pipe(
      combineLatestWith(this.hasHeader$),
      map(([scope, hasHeader]) => hasHeader ? scope.child ?? scope : scope),
      subscribed(this._hasChildren$),
      cache()
    );
    //</editor-fold>

    //<editor-fold desc="Wrapper">
    this.wrapper$ = this.scope$.pipe(
      combineLatestWith(this.hasChildren$, this.hasHeader$),
      map(
        ([scope,  hasChildren, hasHeader]) => ({
          classes: [
            'ngx-ui-scope',
            hasChildren ? 'has-children' : 'no-children',
            hasHeader ? `${scope.class}-content` : 'no-header'
          ],
          scrollable: !hasChildren
        })
      ),
      auditTime(0),
      cache()
    );

    this._wrapper$ = this.wrapper$.pipe(
      subscribed(this._hasWrapper$),
      persistentCache(0)
    );
    //</editor-fold>

    //<editor-fold desc="Header">

    this.header$ = passiveScope$.pipe(
      map(x => ({
        classes: [`${x.class}-header`, 'ngx-ui-header'],
        showMenu: !!x.showMenu
      })),
      cache()
    );

    this._header$ = this.header$.pipe(
      subscribed(this._hasHeader$),
      persistentCache(0)
    );
    //</editor-fold>
  }

  override registerHeader(apply: (wrapper: HeaderData) => void): Subscription {
    return this._header$.subscribe(apply);
  }

  registerHeader$() {
    return this._header$;
  }

  override registerWrapper(apply: (wrapper: WrapperData) => void): Subscription {
    return this._wrapper$.subscribe(apply);
  }

  registerWrapper$() {
    return this._wrapper$;
  }
}

@Injectable()
export class RootUIScopeContext extends BaseUIScopeContext {

  constructor() {
    super(of(inject(UI_SCOPE_CONFIG).default));
  }

}

const UI_SCOPE_CONFIG = new InjectionToken<UIScopeConfig>('Config for UI Scope');

export interface UIScopeConfig {
  readonly default: UIScope;
}

type UITabScope = UIScope & {readonly child: UIScope};

export interface UIScope {
  readonly class: string;
  readonly showMenu?: boolean;
  readonly child?: UIScope;
  readonly tabScope?: UITabScope;
}

interface WrapperData {
  classes: string[]
  scrollable: boolean;
}

interface HeaderData {
  classes: string[];
  showMenu: boolean;
}
