import {
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef,
  HostBinding, inject, Input, OnDestroy, OnInit, Output, QueryList
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {auditTime, merge, Observable, startWith, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {NgxTabBarContext, NgxTabContext} from "../../services";
import {RouteService} from "@consensus-labs/ngx-tools";
import {INavTab} from "../../models/nav-tab.interface";
import {TabPanelUIScopeContext} from "../../services/tab-panel-ui-scope.context";
import {TabBarUIScopeContext} from "../../services/tab-bar-ui-scope.context";
import {UIScopeContext} from "../../../../models";

@Component({
  selector: 'ngx-tab-bar',
  templateUrl: './ngx-tab-bar.component.html',
  styleUrls: ['./ngx-tab-bar.component.scss'],
  providers: [
    {provide: NgxTabBarContext, useExisting: forwardRef(() => NgxTabBarComponent)},
    TabBarUIScopeContext,
    TabPanelUIScopeContext
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxTabBarComponent extends NgxTabBarContext implements OnInit, AfterContentInit, OnDestroy {

  @ContentChildren(NgxTabContext, {descendants: false})
  private children?: QueryList<NgxTabContext>;

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

  panelClass$: Observable<string[]>;
  headerClass$: Observable<string[]>;

  private readonly context = inject(UIScopeContext, {skipSelf: true, optional: true});
  private readonly tabContext = inject(TabBarUIScopeContext, {self: true});
  readonly route = inject(ActivatedRoute, {optional: true});

  constructor(
    private router: Router,
    private routeService: RouteService,
    private changes: ChangeDetectorRef
  ) {
    super();

    this.tabContext = inject(TabBarUIScopeContext, {self: true});
    this.headerClass$ = this.tabContext.registerHeader$().pipe(map(x => x.classes));
    this.panelClass$ = this.tabContext.registerWrapper$().pipe(map(x => x.classes));
  }

  ngOnInit() {

    if (this.context) {
      this.sub.add(this.context.registerWrapper(x => {
        this.wrapperClass = x.classes;
        this.changes.detectChanges();
      }));
    }

    this.sub.add(this.slug$.subscribe(this.slugChange));

    if (this.route) {
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

