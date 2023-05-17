import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {
  AnyTreeState, TreeDataSource, TreeFolder, TreeItem, TreeSearchColumnConfig, TreeSearchRowData, TreeState
} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {TreeFolderContext} from "../../models/tree-folder-context.service";

@Component({
  selector: 'ngx-nav-tree-search-result',
  templateUrl: './nav-tree-search-result.component.html',
  styleUrls: ['./nav-tree-search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTreeSearchResultComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  @Input() dataSource!: TreeDataSource<TFolder, TItem>;
  @Input('state') externalState?: AnyTreeState<TFolder, TItem>;
  state!: AnyTreeState<TFolder, TItem>;

  @Output() folderClick = new EventEmitter<TFolder>();
  @Output() itemClick = new EventEmitter<TItem>();

  @Output() rowClick = new EventEmitter<TreeSearchRowData<TFolder, TItem>>();

  @Input() hideFolders = false;
  @Input() hideItems = false;
  @Input() loading?: boolean;
  @Input() showOpenFolder = false;

  @Input() routeNav: boolean | ActivatedRoute | undefined;

  columnIds: string[] = [];

  get data$(): Observable<TreeSearchRowData<TFolder, TItem>[]> {
    return this.hideFolders ? this.dataSource.itemSearchResult$ :
      !this.hideItems ? this.dataSource.searchResult$ :
        this.dataSource.folderSearchResult$
  }

  dataMap(col: TreeSearchColumnConfig<any, any, any, any>) {
    return (row: TreeSearchRowData<TFolder, TItem>) => row.data[col.id];
  }

  typeMap(col: TreeSearchColumnConfig<any, any, any, any>) {
    return (row: TreeSearchRowData<TFolder, TItem>) => row.isFolder ? col.folder.dataType : col.item.dataType;
  }

  private folderContext = inject(TreeFolderContext, {optional: true});

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    if (!this.dataSource) {
      console.error('Datasource is required for Nav Trees');
      return;
    }

    this.state = this.externalState ?? new TreeState(this.dataSource);

    const hasActions = this.dataSource.hasActions || this.showOpenFolder;
    const columns = this.dataSource.columns.map(x => x.id);
    this.columnIds = hasActions ? [...columns, '_actions'] : columns;
  }

  hasParent(row: TreeSearchRowData<TFolder, TItem>) {
    return row.isFolder ? !!row.model.parentId : !!row.model.folderId;
  }

  showActions(row: TreeSearchRowData<TFolder, TItem>) {
    return row.actions.length || (this.showOpenFolder && this.hasParent(row))
  }

  getId(index: number, item: TreeSearchRowData<TFolder, TItem>) {
    return item.model.model.id;
  }

  //<editor-fold desc="Row Clicks">
  async onRowClick(row: TreeSearchRowData<TFolder, TItem>, event?: MouseEvent) {

    this.rowClick.emit(row);

    if (row.isFolder) {
      await this.onFolderClick(row.model);
      return;
    }

    await this.onItemClick(row.model);
  }

  private async onFolderClick(folder: TreeFolder<TFolder, TItem>) {

    this.folderContext?.setOpenFolderPath(folder, true);
    this.folderClick.emit(folder.model);

    if (this.routeNav && this.state instanceof TreeState) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      await this.router.navigate([folder.model.id], {relativeTo: baseRoute});
      return;
    }

    this.state.setFolder(folder);
    return;
  }

  private async onItemClick(item: TreeItem<TFolder, TItem>) {

    this.folderContext?.openItemPath(item);
    this.itemClick.emit(item.model);

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      const route = this.state instanceof TreeState ? [item.folderId, item.model.id] : [item.model.id];

      await this.router.navigate(
        route,
        {relativeTo: baseRoute, queryParamsHandling: 'preserve'}
      );
      return;
    }

    this.state.setItem(item);
  }

  async onOpenFolder(row: TreeSearchRowData<TFolder, TItem>) {
    const folder = row.isFolder ? row.model.path.at(-1) : row.model.folder;
    if (!folder) return;

    await this.onFolderClick(folder);
  }
  //</editor-fold>
}
