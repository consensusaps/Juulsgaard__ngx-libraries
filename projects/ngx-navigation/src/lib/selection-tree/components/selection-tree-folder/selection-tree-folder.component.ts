import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {TreeFolderData} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {SelectionTreeContext} from "../../models/selection-tree-context";
import {TreeFolderContext} from "../../../nav-tree/models/tree-folder-context.service";

@Component({
  selector: 'cms-selection-tree-folder',
  templateUrl: './selection-tree-folder.component.html',
  styleUrls: ['./selection-tree-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// TODO: Rewrite to OnPush
export class SelectionTreeFolderComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  folder!: TreeFolderData<TFolder, TItem>;
  hasFolders = false;
  hasItems = false;

  get hasContent() {return this.hasFolders || this.hasItems}

  expanded$!: Observable<boolean>;
  active$!: Observable<boolean>;
  indeterminate$!: Observable<boolean>;

  folder$ = new ReplaySubject<TreeFolderData<TFolder, TItem>>(1);
  @Input('folder') set folderData(folder: TreeFolderData<TFolder, TItem>) {
    this.folder = folder;
    this.folder$.next(folder);
    this.hasFolders = !!folder.folders?.length;
    this.hasItems = !!folder.items.length;
  };

  folders$!: Observable<TreeFolderData<TFolder, TItem>[]>;

  constructor(public context: SelectionTreeContext<TFolder, TItem>, public folderState: TreeFolderContext) { }

  ngOnInit() {
    this.expanded$ = this.context.folderOpen$(this.folder.model.model.id);

    this.folders$ = this.context.hideEmpty$.pipe(
      distinctUntilChanged(),
      switchMap(hide => hide
        ? this.folder$.pipe(map(f => f.folders.filter(sub => sub.model.itemCount > 0)))
        : this.folder$.pipe(map(f => f.folders))
      )
    );

    const folderState$ = this.folder$.pipe(this.context.folderStatePipe());
    this.active$ = folderState$.pipe(switchMap(([active, _]) => active));
    this.indeterminate$ = folderState$.pipe(switchMap(([_, indeterminate]) => indeterminate));
  }

  getId(index: number, item: {model: {model: WithId}}) {
    return item.model.model.id;
  }

  onCheckbox(event: MatCheckboxChange) {
    this.context.toggleFolder(this.folder.model, event.checked);
  }
}
