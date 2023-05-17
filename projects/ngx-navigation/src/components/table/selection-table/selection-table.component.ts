import {
  AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList, TemplateRef
} from '@angular/core';
import {TableColumn, TableData} from "@consensus-labs/data-sources";
import {arrToMap, WithId} from "@consensus-labs/ts-tools";
import {CommonModule} from "@angular/common";
import {MatSortModule} from "@angular/material/sort";
import {MatRippleModule} from "@angular/material/core";
import {NoClickBubbleDirective, TruthyPipe} from "@consensus-labs/ngx-tools";
import {ContextMenuDirective, LoadingOverlayComponent} from "@consensus-labs/ngx-material";
import {MatIconModule} from "@angular/material/icon";
import {distinctUntilChanged, Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TableColumnComponent} from "../../shared/table-column/table-column.component";
import {NavMenuItemComponent} from "../../shared/nav-menu-item/nav-menu-item.component";
import {NavPaginatorComponent} from "../../shared/nav-paginator/nav-paginator.component";
import {SelectionListContext} from "../../../models/selection-list-context";
import {TableTemplateContext, TableTemplateDirective} from "../../../directives/table-template.directive";

@Component({
  selector: 'ngx-selection-table',
  templateUrl: './selection-table.component.html',
  styleUrls: ['./selection-table.component.scss'],
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
    MatIconModule,
    MatCheckboxModule,
    TruthyPipe
  ]
})
export class SelectionTableComponent<TModel extends WithId> extends SelectionListContext<TModel> implements AfterContentInit {

  @ContentChildren(TableTemplateDirective) templateQuery?: QueryList<TableTemplateDirective<TModel>>;
  templateLookup$?: Observable<Map<string, TemplateRef<TableTemplateContext<TModel>>>>;

  set templates$(templates$: Observable<TableTemplateDirective<TModel>[]>) {
    this.templateLookup$ = templates$.pipe(
      distinctUntilChanged(),
      map(list => arrToMap(list, x => x.id, x => x.template)),
      cache()
    );
  }

  @Input() loading?: boolean;
  columnIds: string[] = [];

  override ngOnInit() {
    super.ngOnInit();
    this.columnIds = [...this.dataSource.columnIds, '_selection'];
  }

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
}
