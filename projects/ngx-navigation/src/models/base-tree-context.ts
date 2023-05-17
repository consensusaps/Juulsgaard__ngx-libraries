import {inject, Injectable} from "@angular/core";
import {WithId} from "@consensus-labs/ts-tools";
import {TreeDataSource} from "@consensus-labs/data-sources";
import {BehaviorSubject, firstValueFrom, Observable, of} from "rxjs";
import {distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {TreeFolderContext} from "../lib/nav-tree/models/tree-folder-context.service";

@Injectable()
export abstract class BaseTreeContext<TFolder extends WithId, TItem extends WithId> {

  protected abstract dataSource: TreeDataSource<TFolder, TItem>

  protected readonly _expandAll$ = new BehaviorSubject<boolean>(false)
  public readonly expandAll$: Observable<boolean> = this._expandAll$.pipe(distinctUntilChanged());

  protected readonly _hideEmpty$ = new BehaviorSubject<boolean>(false)
  public readonly hideEmpty$: Observable<boolean> = this._hideEmpty$.pipe(distinctUntilChanged());

  public readonly folderState: TreeFolderContext;

  protected constructor() {
    this.folderState = inject(TreeFolderContext, {optional: true, skipSelf: true}) ?? new TreeFolderContext();
  }

  //<editor-fold desc="Folder State Methods">
  /**
   * Open all folders in path for item
   * This method uses a lookup to generate the path from an id
   * @param itemId - Id of Item
   */
  async openItemIdPath(itemId: string) {
    const item = await firstValueFrom(this.dataSource.baseItemLookup$.pipe(
      map(lookup => lookup.get(itemId))
    ));

    if (!item) return;
    await this.openFolderIdPath(item.folderId, true);
  }

  /**
   * Opens all folders in the given folder's path
   * This method uses a lookup to generate the path from an id
   * @param folderId - Id of starting point
   * @param includeFolder - If true the starting folder will also be expanded
   */
  async openFolderIdPath(folderId: string, includeFolder = false) {
    const path = await this.getFolderIdPath(folderId, includeFolder);
    this.folderState.openFolders(path.map(x => x.model.id));
  }

  private async getFolderIdPath(folderId: string, includeFolder = false) {
    const lookup = await firstValueFrom(this.dataSource.baseFolderLookup$);
    const folder = lookup.get(folderId);
    if (!folder) return [];

    const path = includeFolder ? [folder] : [];
    let parentId = folder.parentId;

    while (parentId) {
      const parent = lookup.get(parentId);
      if (!parent) break;
      path.push(parent);
      parentId = parent.parentId;
    }

    return path.reverse();
  }

  /**
   * Generate an observable that indicates when a folder should be shown as open.
   * Takes expandAll into account
   * @param folderId - Folder
   */
  folderOpen$(folderId: string) {
    return this.expandAll$.pipe(
      switchMap(b => b ? of(true) : this.folderState.isOpen$(folderId))
    )
  }

  //</editor-fold>

}
