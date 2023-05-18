import {
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef,
  HostBinding, inject, Injectable, Input, OnDestroy, OnInit, Output, QueryList
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {auditTime, EMPTY, merge, Observable, startWith, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {NgxTabBarContext, NgxTabContext} from "../../services";
import {RouteService} from "@consensus-labs/ngx-tools";
import {INavTab} from "../../models/nav-tab.interface";
import {BaseUIScopeContext, UIScopeContext} from "../../../../models/ui-scope";

@Component({
  selector: 'ngx-tab-bar',
  templateUrl: './ngx-tab-bar.component.html',
  styleUrls: ['./ngx-tab-bar.component.scss'],
  providers: [
    {provide: NgxTabBarContext, useExisting: forwardRef(() => NgxTabBarComponent)},
    {provide: forwardRef(() => TabUIScopeContext)},
    {provide: UIScopeContext, useClass: forwardRef(() => SubTabUIScopeContext)}
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
  private readonly tabContext = inject(TabUIScopeContext, {self: true});
  readonly route = inject(ActivatedRoute, {optional: true});

  constructor(
    private router: Router,
    private routeService: RouteService,
    private changes: ChangeDetectorRef
  ) {
    super();

    this.tabContext = inject(TabUIScopeContext, {self: true});
    this.panelClass$ = this.tabContext.registerWrapper$().pipe(map(x => x.classes));
    this.headerClass$ = this.tabContext.registerHeader$().pipe(map(x => x.classes));
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

@Injectable()
class TabUIScopeContext extends BaseUIScopeContext {
  constructor() {
    const context = inject(UIScopeContext, {skipSelf: true, optional: true});
    super(context?.childScope$.pipe(map(x => x.tabScope ?? x)) ?? EMPTY);
  }
}

@Injectable()
class SubTabUIScopeContext extends BaseUIScopeContext {
  constructor() {
    const context = inject(TabUIScopeContext, {self: true, optional: true});
    super(context?.childScope$ ?? EMPTY, context?.passiveChildScope$);
  }
}
