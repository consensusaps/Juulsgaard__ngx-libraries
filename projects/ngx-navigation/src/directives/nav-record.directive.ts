import {
  AfterContentInit, ChangeDetectorRef, ComponentRef, ContentChildren, Directive, EventEmitter, Input, OnChanges, OnInit,
  Output, QueryList, SimpleChanges, ViewContainerRef
} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {BehaviorSubject, distinctUntilChanged, Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {CreateAction, ListDataSource} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {persistentCache} from "@consensus-labs/rxjs-tools";
import {Dispose} from "@consensus-labs/ngx-tools";
import {ActivatedRoute} from "@angular/router";
import {TableTemplateDirective} from "./table-template.directive";
import {NavTableComponent} from "../components/table/nav-table/nav-table.component";
import {NavListComponent} from "../components/list/nav-list/nav-list.component";

@Directive({selector: 'ngx-nav-record', standalone: true, host: {'[style.display]': '"none"'}})
export class NavRecordDirective<TModel extends WithId> implements OnChanges, OnInit, AfterContentInit {

  @ContentChildren(TableTemplateDirective) private templateQuery?: QueryList<TableTemplateDirective<TModel>>;
  private templates$ = new BehaviorSubject<TableTemplateDirective<TModel>[]>([]);

  @Input() dataSource!: ListDataSource<TModel>;
  @Input() routeNav: boolean|undefined|ActivatedRoute;
  @Input() loading?: boolean;
  @Input() activeItem?: TModel|string|null;

  @Input() showSearch?: boolean;
  @Input() createActions: CreateAction[] = [];

  @Output() itemClick = new EventEmitter<TModel>();

  showTable$: Observable<boolean>;
  @Dispose sub = new Subscription();
  @Dispose componentSub?: Subscription;

  component?: ComponentRef<NavTableComponent<TModel>|NavListComponent<TModel>>;

  constructor(private breakpointObserver: BreakpointObserver, private viewContainer: ViewContainerRef, private changes: ChangeDetectorRef) {
    this.showTable$ = breakpointObserver.observe('(min-width: 1001px)').pipe(
      map(x => x.matches),
      distinctUntilChanged(),
      persistentCache()
    );
  }

  ngOnInit() {
    this.sub.add(this.showTable$.subscribe(table => {

      this.componentSub?.unsubscribe();
      this.component?.destroy();

      if (table) {
        const component = this.viewContainer.createComponent(NavTableComponent<TModel>);
        component.instance.templates$ = this.templates$.asObservable();
        this.component = component;
      } else {
        this.component = this.viewContainer.createComponent(NavListComponent<TModel>);
      }

      this.componentSub = this.component.instance.itemClick.subscribe(this.itemClick);

      this.populateComponent();
      this.changes.detectChanges();
    }));
  }

  ngAfterContentInit() {
    if (!this.templateQuery) return;
    this.templates$.next(this.templateQuery.toArray());
    this.sub.add(this.templateQuery.changes.pipe(
      map(() => this.templateQuery?.toArray() ?? [])
    ).subscribe(this.templates$));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.populateComponent();
  }

  populateComponent() {
    if (!this.component) return;

    // [!] This typed way of setting inputs does not work with input aliases
    setInput(this.component, 'dataSource', this.dataSource);
    setInput(this.component, 'routeNav', this.routeNav);
    setInput(this.component, 'loading', this.loading);
    setInput(this.component, 'activeItem', this.activeItem);

    if (this.component.instance instanceof NavListComponent) {
      const comp = this.component as ComponentRef<NavListComponent<TModel>>;
      setInput(comp, 'showSearch', this.showSearch);
      setInput(comp, 'createActions', this.createActions);
    }
  }
}

function setInput<T, TKey extends Extract<keyof T, string>>(component: ComponentRef<T>, key: TKey, value: T[TKey]) {
  component.setInput(key, value);
}
