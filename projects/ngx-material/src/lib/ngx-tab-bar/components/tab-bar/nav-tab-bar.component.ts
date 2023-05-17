import {
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef,
  HostBinding, inject, Injectable, Input, OnDestroy, OnInit, Output, QueryList
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {auditTime, EMPTY, merge, Observable, startWith, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {NavTabBarContext, NavTabContext} from "../../services";
import {RouteService} from "@consensus-labs/ngx-tools";
import {INavTab} from "../../models/nav-tab.interface";
import {BaseUIScopeContext, UIScopeContext} from "../../../../models/ui-scope";

@Component({
  selector: 'ngx-tab-bar',
  templateUrl: './nav-tab-bar.component.html',
  styleUrls: ['./nav-tab-bar.component.scss'],
  providers: [
    {provide: NavTabBarContext, useExisting: NavTabBarComponent},
    {provide: UIScopeContext, useClass: forwardRef(() => TabUIScopeContext)}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTabBarComponent extends NavTabBarContext implements OnInit, AfterContentInit, OnDestroy {

  @ContentChildren(NavTabContext, {descendants: false})
  private children?: QueryList<NavTabContext>;

  private readonly sub = new Subscription();

  @Input() fragmentNav = false;
  @Input() urlNav?: string;
  @Input() relativeTo?: ActivatedRoute|null;

  @Input('active') set _active(active: boolean | undefined) {
    this.setActive(active ?? true);
  }

  @Input() set slug(slug: string | null) {
    this.setSlug(slug ?? undefined)
  }

  @Output() slugChange = new EventEmitter<string | null>();

  @HostBinding('class')
  wrapperClass: string[] = [];

  panelClass$?: Observable<string[]>;
  headerClass$?: Observable<string[]>;

  private readonly context = inject(UIScopeContext, {skipSelf: true, optional: true});
  private readonly tabContext: UIScopeContext|undefined;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private routeService: RouteService,
    private changes: ChangeDetectorRef
  ) {
    super();

    this.tabContext = this.context
      ? new BaseUIScopeContext(this.context.childScope$.pipe(map(x => x.tabScope ?? x)))
      : undefined;

    if (this.tabContext) {
      this.tabContext.registerHeader(this);
      this.panelClass$ = this.tabContext.wrapperClass$.pipe(map(x => x ? [x, 'scrollable-content'] : []));
      this.headerClass$ = this.tabContext.headerClass$.pipe(map(x => x ? [x] : []));
    }

  }

  ngOnInit() {

    if (this.context) {
      this.sub.add(this.context.wrapperClass$.subscribe(x => {
        this.wrapperClass = x ? [x, 'scrollable-content'] : [];
        this.changes.detectChanges();
      }));
    }

    this.sub.add(this.slug$.subscribe(this.slugChange));

    if (this.fragmentNav) {
      this.sub.add(
        this.route.fragment.subscribe(x => this.setSlug(x ?? undefined))
      );
    }

    if (this.urlNav) {
      this.sub.add(
        this.routeService.params$.subscribe(params => this.setSlug(this.urlNav && params.get(this.urlNav)))
      );
    }
  }

  ngAfterContentInit() {
    if (!this.children) return;

    const children$ = this.children.changes.pipe(
      map(() => this.children?.toArray() ?? []),
      startWith(this.children.toArray()),
      cache()
    );

    // Re-run the logic every time the tabs change
    this.sub.add(children$.subscribe(x => this.setTabs(x)));

    // Re-run logic if any of the tabs change state
    const childChanges$ = children$.pipe(
      switchMap(children => merge(...children.map(x => x.changes$))),
      auditTime(0)
    );

    this.sub.add(childChanges$.subscribe(
      () => this.setTabs(this.children?.toArray() ?? [])
    ));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.tabContext?.unregisterHeader(this);
  }

  override async openTab(slug: string) {
    if (this.fragmentNav) {
      await this.router.navigate([], {fragment: slug, relativeTo: this.relativeTo ?? this.route, replaceUrl: true});
      return;
    }
    if (this.urlNav) {
      await this.router.navigate([slug ?? '.'], {relativeTo: this.relativeTo ?? this.route, replaceUrl: true});
      return;
    }
    this.setSlug(slug);
  }

  async clickTab(tab: INavTab) {
    if (!this.active) return;
    if (tab.isDisabled) return;
    if (tab.isHidden) return;

    if (this.urlNav) return;
    if (this.fragmentNav) return;

    await this.openTab(tab.id);
  }

  getRouterLink(tab: INavTab): string[] | undefined {
    if (this.urlNav) return [tab.id];
    if (this.fragmentNav) return [];
    return undefined;
  }

  getFragment(tab: INavTab): string | undefined {
    if (this.fragmentNav) return tab.id;
    return undefined;
  }
}

@Injectable()
class TabUIScopeContext extends BaseUIScopeContext {
  constructor() {
    const context = inject(UIScopeContext, {skipSelf: true, optional: true});
    super(context?.childScope$.pipe(map(x => x.tabScope?.child ?? x)) ?? EMPTY);
  }
}
