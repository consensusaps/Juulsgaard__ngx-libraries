import {inject, Injectable, InjectionToken, Provider} from '@angular/core';
import {BehaviorSubject, combineLatestWith, Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {cache, subscribed} from "@consensus-labs/rxjs-tools";

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

  readonly abstract wrapperClasses$: Observable<string[]>;
  readonly abstract headerClasses$: Observable<string[]>;
  readonly abstract childScope$: Observable<UIScope>;
  readonly abstract passiveChildScope$: Observable<UIScope>;

  readonly abstract showMenu$: Observable<boolean>;
  readonly abstract scope$: Observable<UIScope>;
}

export class BaseUIScopeContext extends UIScopeContext {

  //<editor-fold desc="Header">
  headerClasses$: Observable<string[]>;

  private readonly _hasHeader$ = new BehaviorSubject(false);
  readonly hasHeader$ = this._hasHeader$.asObservable();
  get hasHeader() {return this._hasHeader$.value}
  //</editor-fold>

  //<editor-fold desc="Wrapper">
  wrapperClasses$: Observable<string[]>;

  private readonly _hasWrapper$ = new BehaviorSubject(false);
  readonly hasWrapper$ = this._hasWrapper$.asObservable();
  get hasWrapper() {return this._hasWrapper$.value}
  //</editor-fold>

  //<editor-fold desc="Children">
  childScope$: Observable<UIScope>;
  passiveChildScope$: Observable<UIScope>;

  private readonly _hasChildren$ = new BehaviorSubject(false);
  readonly hasChildren$ = this._hasChildren$.asObservable();
  get hasChildren() {return this._hasChildren$.value}
  //</editor-fold>

  showMenu$: Observable<boolean>;

  constructor(public scope$: Observable<UIScope>, passiveScope$?: Observable<UIScope>) {
    super();

    passiveScope$ ??= scope$;

    this.showMenu$ = passiveScope$.pipe(
      map(x => x.showMenu ?? false)
    );

    this.passiveChildScope$ = this.scope$.pipe(
      combineLatestWith(this.hasHeader$),
      map(([scope, hasHeader]) => hasHeader ? scope.child ?? scope : scope),
      cache()
    );

    this.childScope$ = this.passiveChildScope$.pipe(
      subscribed(this._hasChildren$),
      cache()
    );

    this.wrapperClasses$ = this.scope$.pipe(
      combineLatestWith(this.hasChildren$, this.hasHeader$),
      map(
        ([scope,  hasChildren, hasHeader]) => [
          'ngx-ui-scope',
          hasChildren ? 'has-children' : 'no-children',
          hasHeader ? `${scope.class}-content` : 'no-header'
        ]
      ),
      subscribed(this._hasWrapper$),
      cache()
    );

    this.headerClasses$ = passiveScope$.pipe(
      map(x => [`${x.class}-header`, 'ngx-ui-header']),
      subscribed(this._hasHeader$),
      cache()
    );
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
