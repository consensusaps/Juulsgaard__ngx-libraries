import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {auditTime, combineLatest, Observable} from "rxjs";
import {TreeFolderData, TreeItemData} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {map} from "rxjs/operators";
import {NavTreeContext} from "../../models/nav-tree-context";
import {TreeClipboardContext} from "../../models/tree-clipboard-context.service";
import {TreeFolderContext} from "../../models/tree-folder-context.service";
import {applyCdkDrag} from "../../../../util/drag-drop";

@Component({
  selector: 'ngx-nav-tree-folder',
  templateUrl: './nav-tree-folder.component.html',
  styleUrls: ['./nav-tree-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTreeFolderComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  folder!: TreeFolderData<TFolder, TItem>;
  hasFolders = false;
  hasItems = false;

  get hasContent() {
    return this.hasFolders || this.hasItems
  }

  expanded$!: Observable<boolean>;
  active$!: Observable<boolean>;
  selected$!: Observable<boolean>;
  inClipboard$!: Observable<boolean>;
  canPaste$!: Observable<boolean>;

  @Input('folder') set folderData(folder: TreeFolderData<TFolder, TItem>) {
    this.folder = folder;
    this.hasFolders = !!folder.folders?.length;
    this.hasItems = !!folder.items.length;
  };

  constructor(
    public context: NavTreeContext<TFolder, TItem>,
    private clipboard: TreeClipboardContext,
    public folderState: TreeFolderContext
  ) {
  }

  ngOnInit() {
    this.active$ = this.context.folderActive$(this.folder.model.model.id);
    this.expanded$ = this.context.folderOpen$(this.folder.model.model.id);

    this.selected$ = this.clipboard.folderSelected$(this.folder.model.model.id);
    this.inClipboard$ = this.clipboard.folderInClipboard$(this.folder.model.model.id);

    this.canPaste$ = combineLatest([this.context.showPasteFolders$, this.context.showPasteItems$]).pipe(
      auditTime(0),
      map(([a, b]) => a || b)
    );
  }

  getId(index: number, item: TreeItemData<TFolder, TItem>) {
    return item.model.model.id;
  }

  async toggleSelection() {
    if (this.context.canRelocateFolder) {
      this.clipboard.toggleFolderSelection(this.folder.model.model.id);
      return;
    }

    await this.onClick();
  }

  async onClick(event?: MouseEvent) {

    if (event && this.context.canRelocateFolder) {
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        this.clipboard.toggleFolderSelection(this.folder.model.model.id);
        return;
      }
    }

    await this.context.clickFolder(this.folder.model);
  }

  onPaste() {
    this.context.paste(this.folder.model);
  }

  async onItemDrop(event: CdkDragDrop<any>) {
    const list = this.folder.items.map(x => x.model.model) ?? [];
    const model = applyCdkDrag(list, event);
    if (!model) return;
    await this.context.moveItem(model);
  }
}
