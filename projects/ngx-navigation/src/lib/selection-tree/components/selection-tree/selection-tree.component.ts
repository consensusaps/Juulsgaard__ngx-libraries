import {ChangeDetectionStrategy, Component, forwardRef, HostBinding, inject, Input} from '@angular/core';
import {AnyTreeSelection, TreeDataSource, TreeFolderData} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {TreeFolderContext} from "../../../nav-tree/models/tree-folder-context.service";
import {SelectionTreeContext} from "../../models/selection-tree-context";

@Component({
  selector: 'cms-selection-tree',
  templateUrl: './selection-tree.component.html',
  styleUrls: ['./selection-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: SelectionTreeContext, useExisting: forwardRef(() => SelectionTreeComponent)},
    {provide: TreeFolderContext, useFactory: () => inject(SelectionTreeContext).folderState, deps: [SelectionTreeContext]},
  ]
})
export class SelectionTreeComponent<TFolder extends WithId, TItem extends WithId> extends SelectionTreeContext<TFolder, TItem> {

  @HostBinding('class.cms-fill') fill = true;
  @HostBinding('class.nav-tree') treeClass = true;

  @Input() dataSource!: TreeDataSource<TFolder, TItem>;
  @Input() state!: AnyTreeSelection<TFolder, TItem>;

  @Input() loading?: boolean;

  @Input() set expandAll(expand: boolean) {
    this._expandAll$.next(expand);
  }

  @Input() set hideEmpty(hide: boolean) {
    this._hideEmpty$.next(hide);
  }

  folders$?: Observable<TreeFolderData<TFolder, TItem>[]>;

  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    this.folders$ = this.hideEmpty$.pipe(
      distinctUntilChanged(),
      switchMap(hide => hide
        ? this.dataSource.treeData$.pipe(map(folders => folders.filter(sub => sub.model.itemCount > 0)))
        : this.dataSource.treeData$
      )
    );
  }

  getId(index: number, item: TreeFolderData<TFolder, TItem>) {
    return item.model.model.id;
  }
}
