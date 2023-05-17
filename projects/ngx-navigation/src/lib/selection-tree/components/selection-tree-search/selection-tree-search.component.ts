import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {AnyTreeSelection, TreeDataSource, TreeFolder} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {TreeFolderContext} from "../../../nav-tree/models/tree-folder-context.service";

@Component({
  selector: 'cms-selection-tree-search',
  templateUrl: './selection-tree-search.component.html',
  styleUrls: ['./selection-tree-search.component.scss'],
  providers: [TreeFolderContext],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionTreeSearchComponent<TFolder extends WithId, TItem extends WithId>{

  @HostBinding('class.cms-fill') fill = true;

  @Input() dataSource!: TreeDataSource<TFolder, TItem>;
  @Input() state!: AnyTreeSelection<TFolder, TItem>;

  @Input() alwaysHideFolders = false;
  @Input() alwaysHideItems = false;
  @Input() showOpenFolder = false;

  @Input() loading?: boolean;

  @Input() expandAll = false;
  @Input() hideEmpty = false;

  showFolders = true;
  showItems = true;

  get showSearchActions() {
    return this.dataSource.hiddenSortOptions.length > 0 || (!this.alwaysHideFolders && !this.alwaysHideItems);
  }

  constructor() { }

  openSearchFolder(folder: TreeFolder<TFolder, TItem>) {
    this.dataSource.searchQuery$.next('');
  }
}
