import {
  AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, QueryList,
  TemplateRef
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ListData, ListDataSource, TableColumn, TableData} from "@consensus-labs/data-sources";
import {arrToMap, isString, WithId} from "@consensus-labs/ts-tools";
import {CommonModule} from "@angular/common";
import {MatSortModule} from "@angular/material/sort";
import {MatRippleModule} from "@angular/material/core";
import {Dispose, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {ContextMenuDirective, LoadingOverlayComponent} from "@consensus-labs/ngx-material";
import {MatIconModule} from "@angular/material/icon";
import {distinctUntilChanged, Observable, startWith, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NavMenuItemComponent} from "../../shared/nav-menu-item/nav-menu-item.component";
import {NavPaginatorComponent} from "../../shared/nav-paginator/nav-paginator.component";
import {TableTemplateContext, TableTemplateDirective} from "../../../directives/table-template.directive";
import {TableColumnComponent} from "../../shared/table-column/table-column.component";

@Component({
  selector: 'ngx-nav-table',
  templateUrl: './nav-table.component.html',
  styleUrls: ['./nav-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    TableColumnComponent,
    MatRippleModule,
    NoClickBubbleDirective,
    MatMenuModule,
    MatTooltipModule,
    ContextMenuDirective,
    NavMenuItemComponent,
    LoadingOverlayComponent,
    NavPaginatorComponent,
    MatIconModule
  ]
})
export class NavTableComponent<TModel extends WithId> implements AfterContentInit {

  @ContentChildren(TableTemplateDirective) templateQuery?: QueryList<TableTemplateDirective<TModel>>;
  templateLookup$?: Observable<Map<string, TemplateRef<TableTemplateContext<TModel>>>>;

  set templates$(templates$: Observable<TableTemplateDirective<TModel>[]>) {
    this.templateLookup$ = templates$.pipe(
      distinctUntilChanged(),
      map(list => arrToMap(list, x => x.id, x => x.template)),
      cache()
    );
  }

  @Input() routeNav: boolean|undefined|ActivatedRoute;
  @Input() loading?: boolean;

  @Input() dataSource!: ListDataSource<TModel>;

  @Output() itemClick = new EventEmitter<TModel>();

  @Input() set activeItem(item: TModel|string|null|undefined) {
    this.activeId = !item ? undefined : isString(item) ? item : item.id;
  }
  activeId?: string;

  @Dispose sub?: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngAfterContentInit() {
    if (this.templateLookup$) return;
    if (!this.templateQuery) return;

    this.templates$ = this.templateQuery.changes.pipe(
      map(() => this.templateQuery?.toArray() ?? []),
      startWith(this.templateQuery.toArray())
    );
  }

  dataMap(col: TableColumn<TModel, any>) {
    return (row: TableData<TModel>) => row.data[col.id];
  }

  contextMap(col: TableColumn<TModel, any>): (row: TableData<TModel>) =>  TableTemplateContext<TModel> {
    return (row: TableData<TModel>) => ({row: row.model, val: row.data[col.id]});
  }

  async rowClick(row: ListData<TModel>, event: MouseEvent) {
    if ((event as any).copiedId) return;
    this.itemClick.emit(row.model);

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      await this.router.navigate([row.id], {relativeTo: baseRoute});
    }
  }

  getId(index: number, item: WithId) {
    return item.id;
  }
}
