import {Injectable, Provider} from '@angular/core';
import {combineLatestWith, distinctUntilChanged, Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {cache, ObservableSet} from "@consensus-labs/rxjs-tools";

@Injectable()
export abstract class UIScopeContext {

  public static Provide(config: UIScopeConfig): Provider {
    return {provide: UIScopeContext, useValue: new RootUIScopeContext(config)};
  }

  readonly abstract hasHeader$: Observable<boolean>;
  readonly abstract hasHeader: boolean;

  readonly abstract wrapperClass$: Observable<string|undefined>;
  readonly abstract headerClass$: Observable<string|undefined>;
  readonly abstract showMenu$: Observable<boolean>;
  readonly abstract scope$: Observable<UIScope>;
  readonly abstract childScope$: Observable<UIScope>;

  abstract registerHeader(header: any): void;
  abstract unregisterHeader(header: any): void;
}

export class BaseUIScopeContext extends UIScopeContext {

  private headers$ = new ObservableSet<object>();

  readonly hasHeader$ = this.headers$.size$.pipe(
    map(size => size > 0),
    distinctUntilChanged()
  );
  get hasHeader() {return this.headers$.size > 0}

  wrapperClass$: Observable<string|undefined>;
  headerClass$: Observable<string>;
  childScope$: Observable<UIScope>;
  showMenu$: Observable<boolean>;

  constructor(public scope$: Observable<UIScope>) {
    super();

    this.showMenu$ = this.scope$.pipe(
      map(x => x.showMenu ?? false)
    );

    this.childScope$ = this.scope$.pipe(
      combineLatestWith(this.hasHeader$),
      map(([scope, hasHeader]) => hasHeader ? scope.defaultChild ?? scope : scope)
    );

    this.wrapperClass$ = this.hasHeader$.pipe(
      switchMap(
        hasHeader => !hasHeader
          ? of(undefined)
          : this.scope$.pipe(
            map(x => `${x.class}-content`),
          )
      ),
      cache()
    );

    this.headerClass$ = this.scope$.pipe(
      map(x => `${x.class}-header`),
      cache()
    );
  }

  registerHeader(header: any): void {
    this.headers$.add(header);
  }

  unregisterHeader(header: any): void {
    this.headers$.delete(header);
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
