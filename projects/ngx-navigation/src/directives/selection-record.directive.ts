import {
  AfterContentInit, ChangeDetectorRef, ComponentRef, ContentChildren, Directive, EventEmitter, Input, OnChanges, OnInit,
  Output, QueryList, SimpleChanges, ViewContainerRef
} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {BehaviorSubject, distinctUntilChanged, Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {AnyListSelection, CreateAction, ListDataSource, ListSelection} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {persistentCache} from "@consensus-labs/rxjs-tools";
import {Dispose} from "@consensus-labs/ngx-tools";
import {TableTemplateDirective} from "./table-template.directive";
import {SelectionTableComponent} from "../components/table/selection-table/selection-table.component";
import {SelectionListComponent} from "../components/list/selection-list/selection-list.component";

@Directive({selector: 'ngx-selection-record', standalone: true, host: {'[style.display]': '"none"'}})
export class SelectionRecordDirective<TModel extends WithId> implements OnChanges, OnInit, AfterContentInit {

  @ContentChildren(TableTemplateDirective) private templateQuery?: QueryList<TableTemplateDirective<TModel>>;
  private templates$ = new BehaviorSubject<TableTemplateDirective<TModel>[]>([]);

  @Input() dataSource!: ListDataSource<TModel>;
  @Input() selection!: AnyListSelection<TModel>;
  @Input() loading?: boolean;

  @Input() showSearch?: boolean;
  @Input() createActions: CreateAction[] = [];

  @Output() itemClick = new EventEmitter<TModel>();

  showTable$: Observable<boolean>;
  @Dispose sub = new Subscription();
  @Dispose componentSub?: Subscription;

  component?: ComponentRef<SelectionTableComponent<TModel>|SelectionListComponent<TModel>>;

  constructor(private breakpointObserver: BreakpointObserver, private viewContainer: ViewContainerRef, private changes: ChangeDetectorRef) {
    this.showTable$ = breakpointObserver.observe('(min-width: 1001px)').pipe(
      map(x => x.matches),
      distinctUntilChanged(),
      persistentCache()
    );
  }

  ngOnInit() {
    this.selection = this.selection ?? new ListSelection(this.dataSource);

    this.sub.add(this.showTable$.subscribe(table => {

      this.componentSub?.unsubscribe();
      this.component?.destroy();

      if (table) {
        const component = this.viewContainer.createComponent(SelectionTableComponent<TModel>);
        component.instance.templates$ = this.templates$.asObservable();
        this.component = component;
      } else {
        this.component = this.viewContainer.createComponent(SelectionListComponent<TModel>);
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
    setInput(this.component, 'selection', this.selection);
    setInput(this.component, 'loading', this.loading);

    if (this.component.instance instanceof SelectionListComponent) {
      const comp = this.component as ComponentRef<SelectionListComponent<TModel>>;
      setInput(comp, 'showSearch', this.showSearch);
      setInput(comp, 'createActions', this.createActions);
    }
  }
}

function setInput<T, TKey extends Extract<keyof T, string>>(component: ComponentRef<T>, key: TKey, value: T[TKey]) {
  component.setInput(key, value);
}
