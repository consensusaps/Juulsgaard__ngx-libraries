import {
  ChangeDetectionStrategy, Component, EventEmitter, HostBinding, inject, Input, OnInit, Output
} from '@angular/core';
import {Observable} from "rxjs";
import {
  AnyTreeSelection, TreeDataSource, TreeFolder, TreeSearchColumnConfig, TreeSearchRowData, TreeSelection
} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {TreeFolderContext} from "../../../nav-tree/models/tree-folder-context.service";

@Component({
  selector: 'app-selection-tree-search-result',
  templateUrl: './selection-tree-search-result.component.html',
  styleUrls: ['./selection-tree-search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// TODO: Rewrite to OnPush
export class SelectionTreeSearchResultComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  @HostBinding('class.cms-fill') fill = true;

  @Input() dataSource!: TreeDataSource<TFolder, TItem>;

  @Input() selection!: AnyTreeSelection<TFolder, TItem>;

  @Input() hideFolders = false;
  @Input() hideItems = false;

  @Input() showOpenFolder = false;
  @Input() loading?: boolean;

  columnIds: string[] = [];

  get data$(): Observable<TreeSearchRowData<TFolder, TItem>[]> {
    return this.hideFolders ? this.dataSource.itemSearchResult$ :
      !this.hideItems ? this.dataSource.searchResult$ :
        this.dataSource.folderSearchResult$
  }

  @Output() openFolder = new EventEmitter<TreeFolder<TFolder, TItem>>();

  private folderContext = inject(TreeFolderContext, {optional: true});

  ngOnInit() {
    if (!this.dataSource) {
      console.error('Datasource is required for Selection Trees');
      return;
    }

    this.selection = this.selection ?? new TreeSelection(this.dataSource);

    const hasActions = this.dataSource.hasActions || this.showOpenFolder;
    const columns = this.dataSource.columns.map(x => x.id);
    this.columnIds = hasActions ? [...columns, '_selection', '_actions'] : [...columns, '_selection'];
  }

  dataMap(col: TreeSearchColumnConfig<any, any, any, any>) {
    return (row: TreeSearchRowData<TFolder, TItem>) => row.data[col.id];
  }

  typeMap(col: TreeSearchColumnConfig<any, any, any, any>) {
    return (row: TreeSearchRowData<TFolder, TItem>) => row.isFolder ? col.folder.dataType : col.item.dataType;
  }

  onRowClick(row: TreeSearchRowData<TFolder, TItem>, event?: MouseEvent) {

    if (row.isFolder) {
      this.folderContext?.setOpenFolderPath(row.model, true);
      this.openFolder.emit(row.model);
      return;
    }

    this.selection.toggleItem(row.model.model);
  }

  onOpenFolder(row: TreeSearchRowData<TFolder, TItem>) {
    const folder = row.isFolder ? row.model.path.at(-1) : row.model.folder;
    if (!folder) return;
    this.folderContext?.setOpenFolderPath(folder, true);
    this.openFolder.emit(folder);
  }

  getId(index: number, item: TreeSearchRowData<TFolder, TItem>) {
    return item.model.model.id;
  }

  hasParent(row: TreeSearchRowData<TFolder, TItem>) {
    return row.isFolder ? !!row.model.parentId : !!row.model.folderId;
  }

  showActions(row: TreeSearchRowData<TFolder, TItem>) {
    return row.actions.length || (this.hasParent(row) && this.showOpenFolder)
  }
}
