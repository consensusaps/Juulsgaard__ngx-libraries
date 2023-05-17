import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AnyTreeState, TreeDataSource, TreeState} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {ActivatedRoute} from "@angular/router";
import {TreeFolderContext} from "../../models/tree-folder-context.service";
import {TreeClipboardContext} from "../../models/tree-clipboard-context.service";

@Component({
  selector: 'ngx-nav-tree-search',
  templateUrl: './nav-tree-search.component.html',
  styleUrls: ['./nav-tree-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeFolderContext, TreeClipboardContext]
})
export class NavTreeSearchComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  @Input() alwaysHideFolders = false;
  @Input() alwaysHideItems = false;
  @Input() loading?: boolean;
  @Input() showOpenFolder = false;

  showFolders = true;
  showItems = true;

  @Input() dataSource!: TreeDataSource<TFolder, TItem>;
  @Input('state') externalState?: AnyTreeState<TFolder, TItem>;
  state!: AnyTreeState<TFolder, TItem>;

  @Output() folderClick = new EventEmitter<TFolder>();
  @Output() itemClick = new EventEmitter<TItem>();

  @Input() expandAll = false;
  @Input() hideEmpty = false;

  @Input() folderName = 'Folders';
  @Input() itemName = 'Items';

  @Input() routeNav: boolean | ActivatedRoute | undefined;

  get showSearchActions() {
    return this.dataSource.hiddenSortOptions.length > 0 || (!this.alwaysHideFolders && !this.alwaysHideItems);
  }

  constructor() {

  }

  ngOnInit() {
    if (!this.dataSource) {
      console.error('Datasource is required for Nav Trees');
      return;
    }

    this.state = this.externalState ?? new TreeState(this.dataSource);
  }

  onFolderClick(folder: TFolder) {
    this.dataSource.searchQuery$.next('');
    this.folderClick.emit(folder);
  }
}
