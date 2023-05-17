import {Injectable, Provider} from '@angular/core';
import {BehaviorSubject, combineLatestWith, Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {cache, subscribed} from "@consensus-labs/rxjs-tools";

@Injectable()
export abstract class UIScopeContext {

  public static Provide(config: UIScopeConfig): Provider {
    return {provide: UIScopeContext, useValue: new RootUIScopeContext(config)};
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

  private readonly _hasChildren$ = new BehaviorSubject(false);
  readonly hasChildren$ = this._hasChildren$.asObservable();
  get hasChildren() {return this._hasChildren$.value}
  //</editor-fold>

  showMenu$: Observable<boolean>;

  constructor(public scope$: Observable<UIScope>) {
    super();

    this.showMenu$ = this.scope$.pipe(
      map(x => x.showMenu ?? false)
    );

    this.childScope$ = this.scope$.pipe(
      combineLatestWith(this.hasHeader$),
      map(([scope, hasHeader]) => hasHeader ? scope.child ?? scope : scope),
      subscribed(this._hasChildren$),
      cache()
    );

    this.wrapperClasses$ = this.hasHeader$.pipe(
      switchMap(
        hasHeader => !hasHeader
          ? of(['ngx-ui-scope', 'no-header'])
          : this.scope$.pipe(
            combineLatestWith(this.hasChildren$),
            map(([scope, hasChildren]) => [
              'ngx-ui-scope',
              `${scope.class}-content`,
              hasChildren ? 'has-children' : 'no-children'
            ])
          )
      ),
      subscribed(this._hasWrapper$),
      cache()
    );

    this.headerClasses$ = this.scope$.pipe(
      map(x => [`${x.class}-header`, 'ngx-ui-header']),
      subscribed(this._hasHeader$),
      cache()
    );
  }
}

@Injectable()
export class RootUIScopeContext extends BaseUIScopeContext {

  constructor(config: UIScopeConfig) {
    super(of(config.default));
  }

}

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

const defaultConfig: UIScopeConfig = {
  default: {
    showMenu: true,
    class: 'main',
    child: {
      class: 'sub',
      tabScope: {
        class: 'tab',
        child: {
          class: 'sub-tab'
        }
      }
    }
  }
}
