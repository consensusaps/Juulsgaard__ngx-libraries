import {
  ChangeDetectionStrategy, Component, computed, contentChildren, effect, forwardRef, inject, Injector, input,
  InputSignal, InputSignalWithTransform, model, ModelSignal, signal, Signal
} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgxTabBarContext, NgxTabContext} from "../../services";
import {elementClassManager, ScopedRouter, scopedRouterAttribute} from "@juulsgaard/ngx-tools";
import {INavTab} from "../../models/nav-tab.interface";
import {UIScopeContext} from "../../../../models";
import {toSignal} from "@angular/core/rxjs-interop";
import {TabBarUIScopeContext} from "../../services/tab-bar-ui-scope.context";

@Component({
  selector: 'ngx-tab-bar',
  templateUrl: './ngx-tab-bar.component.html',
  styleUrls: ['./ngx-tab-bar.component.scss'],
  providers: [
    {provide: NgxTabBarContext, useExisting: forwardRef(() => NgxTabBarComponent)},
    {provide: UIScopeContext, useClass: TabBarUIScopeContext}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxTabBarComponent extends NgxTabBarContext {

  private injector = inject(Injector);
  private readonly route = inject(ActivatedRoute, {optional: true});

  readonly children = contentChildren(NgxTabContext, {descendants: false});
  readonly tabs = computed(() => {
    let tabs = this.children();
    return tabs.filter(t => !t.disabled());
  });
  readonly tab: Signal<NgxTabContext|undefined>;

  readonly fragmentNav: InputSignalWithTransform<
    ScopedRouter | undefined,
    boolean | '' | number | ActivatedRoute | ScopedRouter | undefined | null
  > = input(undefined, {
    transform: scopedRouterAttribute(this.injector, this.route)
  });

  readonly routeNav: InputSignalWithTransform<
    ScopedRouter | undefined,
    boolean | '' | number | ActivatedRoute | ScopedRouter | undefined | null
  > = input(undefined, {
    transform: scopedRouterAttribute(this.injector, this.route)
  });

  protected relativeTo = computed(() => this.routeNav()?.route ?? this.fragmentNav()?.route);

  readonly active: InputSignal<boolean> = input(true);

  readonly slug: ModelSignal<string | undefined> = model<string>();

  constructor() {
    super();

    const context = inject(UIScopeContext, {skipSelf: true});
    const wrapper = context.registerWrapper();
    elementClassManager(computed(() => wrapper().classes));

    this.tab = computed(() => {
      const tabs = this.tabs();
      if (tabs.length <= 0) return undefined;

      const slug = this.slug();
      const tab = slug == null ? undefined :
        tabs.find(x => x.slug() === slug);

      return tab ?? this.children().at(0);
    });

    const fragment = this.route ? toSignal(this.route.fragment) : signal(undefined);

    const routeSlug = computed(() => {
      const urlRouter = this.routeNav();
      if (urlRouter) return urlRouter.subUrl().at(0);

      if (this.fragmentNav()) return fragment() ?? undefined;

      return null;
    });

    effect(() => {
      const slug = routeSlug();
      if (slug === null) return;
      this.slug.set(slug);
    }, {allowSignalWrites: true});
  }

  override async openTab(slug: string) {

    const fragmentRouter = this.fragmentNav();
    if (fragmentRouter) {
      await fragmentRouter.navigate([], {fragment: slug});
      return;
    }

    const urlRouter = this.routeNav();
    if (urlRouter) {
      await urlRouter.navigate([slug ?? '.']);
      return;
    }

    this.slug.set(slug);
  }

  async clickTab(tab: INavTab) {
    if (!this.active()) return;
    if (tab.disabled()) return;
    if (tab.hide()) return;
    if (this.routeNav()) return;
    if (this.fragmentNav()) return;

    await this.openTab(tab.slug());
  }

  getRouterLink(tab: INavTab): string[] | undefined {
    if (this.routeNav()) return [tab.slug()];
    if (this.fragmentNav()) return [];
    return undefined;
  }

  getFragment(tab: INavTab): string | undefined {
    if (this.fragmentNav()) return tab.slug();
    return undefined;
  }
}

