import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TreeItemData} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {NavTreeContext} from "../../models/nav-tree-context";
import {TreeClipboardContext} from "../../models/tree-clipboard-context.service";

@Component({
  selector: 'ngx-nav-tree-item',
  templateUrl: './nav-tree-item.component.html',
  styleUrls: ['./nav-tree-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTreeItemComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  @Input() item!: TreeItemData<TFolder, TItem>;

  active$!: Observable<boolean>;
  selected$!: Observable<boolean>;
  inClipboard$!: Observable<boolean>;

  constructor(
    public context: NavTreeContext<TFolder, TItem>,
    private clipboard: TreeClipboardContext
  ) {
  }

  ngOnInit() {
    this.active$ = this.context.itemActive$(this.item.model.model.id);
    this.selected$ = this.clipboard.itemSelected$(this.item.model.model.id);
    this.inClipboard$ = this.clipboard.itemInClipboard$(this.item.model.model.id);
  }

  async toggleSelection() {
    if (this.context.canRelocateItem) {
      this.clipboard.toggleFolderSelection(this.item.model.model.id);
      return;
    }

    await this.onClick();
  }

  async onClick(event?: MouseEvent) {

    if (event && this.context.canRelocateItem) {
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        this.clipboard.toggleFolderSelection(this.item.model.model.id);
        return;
      }
    }

    await this.context.clickItem(this.item.model);
  }
}
