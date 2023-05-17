import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TreeDataSource} from "@consensus-labs/data-sources";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'ngx-tree-search-actions',
  templateUrl: './tree-search-actions.component.html',
  styleUrls: ['./tree-search-actions.component.scss'],
  standalone: true,
  imports: [
    MatSelectModule,
    NgForOf,
    MatSlideToggleModule,
    FormsModule,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeSearchActionsComponent {

  @Input() dataSource!: TreeDataSource<any, any>;

  @Input() showFolders = true;
  @Output() showFoldersChange = new EventEmitter<boolean>();
  @Input() showItems = true;
  @Output() showItemsChange = new EventEmitter<boolean>();

  @Input() alwaysHideFolders = false;
  @Input() alwaysHideItems = false;

  @Input() folderName = 'Folders';
  @Input() itemName = 'Items';

  constructor() { }

  get sortValue() {
    return this.dataSource.sorting.active.length ? `${this.dataSource.sorting.active}-${this.dataSource.sorting.direction}` : null
  }

  set sortValue(val: string|null) {
    if (!val) {
      this.dataSource.setSort({active: '', direction: 'asc'});
      return;
    }

    const [active, direction] = val.split('-');
    this.dataSource.setSort({active: active!, direction: direction as 'asc'|'desc'|undefined ?? 'asc'});
  }

  toggleFolders(show: boolean) {
    if (!show) this.showItemsChange.emit(true);
    this.showFoldersChange.emit(show);
  }

  toggleItems(show: boolean) {
    if (!show) this.showFoldersChange.emit(true);
    this.showItemsChange.emit(show);
  }


}
