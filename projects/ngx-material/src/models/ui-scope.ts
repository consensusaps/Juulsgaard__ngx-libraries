import {
  assertInInjectionContext, computed, DestroyRef, forwardRef, inject, Injectable, InjectionToken, Injector, Provider,
  signal, Signal, Type
} from '@angular/core';
import {signalSet} from "@juulsgaard/ngx-tools";

@Injectable({providedIn: 'root', useClass: forwardRef(() => RootUIScopeContext)})
export abstract class UIScopeContext {

  public static Provide(config: UIScopeConfig): Provider[] {
    return [
      {provide: UI_SCOPE_CONFIG, useValue: config},
      {provide: UIScopeContext, useClass: RootUIScopeContext}
    ];
  }

  public static ProvideChild(context?: Type<UIScopeContext>): Provider[] {
    return [
      {provide: UIScopeContext, useClass: context ?? ChildUIScopeContext}
    ];
  }

  readonly abstract wrapper: Signal<WrapperData>;
  readonly abstract header: Signal<HeaderData>;
  readonly abstract scope: Signal<UIScope>;
  readonly abstract childScope: Signal<UIScope>;
  readonly abstract tabScope: Signal<UIScope>;

  //<editor-fold desc="Header">
  private readonly headers = signalSet<unknown>();
  readonly hasHeader = computed(() => this.headers.size() > 0);

  registerHeader(injector?: Injector) {
    if (!injector) assertInInjectionContext(this.registerHeader);
    const destroy = injector?.get(DestroyRef) ?? inject(DestroyRef);
    const added = this.headers.add(destroy);
    if (added) destroy.onDestroy(() => this.headers.delete(destroy));
    return this.header;
  }
  //</editor-fold>

  //<editor-fold desc="Wrapper">
  private readonly wrappers = signalSet<unknown>();
  readonly hasWrapper = computed(() => this.wrappers.size() > 0);

  registerWrapper(injector?: Injector) {
    if (!injector) assertInInjectionContext(this.registerWrapper);
    const destroy = injector?.get(DestroyRef) ?? inject(DestroyRef);
    const added = this.wrappers.add(destroy);
    if (added) destroy.onDestroy(() => this.wrappers.delete(destroy));
    return this.wrapper;
  }
  //</editor-fold>

  //<editor-fold desc="Children">
  private readonly _children = signalSet<UIScopeContext>()
  readonly hasChildren = computed(() => this._children.size() > 0);

  readonly hasActiveChildren: Signal<boolean> = computed(
    () => this._children.array().some(x => x.active())
  )
  readonly active: Signal<boolean> = computed(() => this.hasWrapper() || this.hasActiveChildren());
  //</editor-fold>

  registerChild(context: UIScopeContext) {
    assertInInjectionContext(this.registerChild);
    const destroy = inject(DestroyRef);
    const added = this._children.add(context);
    if (added) destroy.onDestroy(() => this._children.delete(context));
  }
}

interface BaseUIScopeContextOptions {
  tabScope: boolean;
}

export abstract class BaseUIScopeContext extends UIScopeContext {

  readonly header: Signal<HeaderData>;
  readonly wrapper: Signal<WrapperData>;
  readonly scope: Signal<UIScope>;
  readonly childScope: Signal<UIScope>;
  readonly tabScope: Signal<UIScope>;

  protected constructor(scope: UIScope);
  protected constructor(parent: UIScopeContext, options?: BaseUIScopeContextOptions);
  protected constructor(param: UIScopeContext|UIScope, options?: BaseUIScopeContextOptions) {
    super();

    const parent = param instanceof UIScopeContext ? param : undefined;
    parent?.registerChild(this);

    this.scope = param instanceof UIScopeContext
      ? options?.tabScope ? param.tabScope : param.childScope
      : signal(param);

    this.childScope = computed(() => {
      const scope = this.scope();
      if (this.hasHeader()) return this.scope().child ?? scope;
      return scope;
    });

    this.tabScope = computed(() => {
      const scope = this.childScope();
      return scope?.tabScope ?? scope;
    });

    this.wrapper = computed(() => {
      const scope = this.scope();
      const hasHeader = this.hasHeader();
      const hasChildren = this.hasActiveChildren();

      return {
        classes: [
          'ngx-ui-scope',
          hasChildren ? 'has-children' : 'no-children',
          hasHeader ? `${scope.class}-content` : 'no-header'
        ],
        scrollable: !hasChildren
      }
    });

    this.header = computed(() => {
      const scope = this.scope();

      return {
        classes: [`${scope.class}-header`, 'ngx-ui-header'],
        showMenu: !!scope.showMenu
      };
    });
  }
}

@Injectable()
export class RootUIScopeContext extends BaseUIScopeContext {

  constructor() {
    super(inject(UI_SCOPE_CONFIG).default);
  }

}

@Injectable()
export class ChildUIScopeContext extends BaseUIScopeContext {
  constructor() {
    super(inject(UIScopeContext, {skipSelf: true}));
  }
}

const UI_SCOPE_CONFIG = new InjectionToken<UIScopeConfig>(
  'Config for UI Scope',
  {
    providedIn: 'root',
    factory: () => ({default: {class: 'ngx-default'}})
  }
);

export interface UIScopeConfig {
  readonly default: UIScope;
}

export interface UIScope {
  readonly class: string;
  readonly showMenu?: boolean;
  readonly child?: UIScope;
  readonly tabScope?: UIScope;
}

interface WrapperData {
  classes: string[]
  scrollable: boolean;
}

interface HeaderData {
  classes: string[];
  showMenu: boolean;
}
