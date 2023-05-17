import {inject, Injectable} from "@angular/core";
import {ObservableSet} from "@consensus-labs/rxjs-tools";
import {Observable} from "rxjs";
import {TreeFolder, TreeItem} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {distinctUntilChanged, map} from "rxjs/operators";

@Injectable()
export class TreeFolderContext {

  private _openFolders$: ObservableSet<string>;
  openFolders$: Observable<ReadonlySet<string>>;
  private parentContext = inject(TreeFolderContext, {optional: true, skipSelf: true});

  constructor() {
    this._openFolders$ = this.parentContext?._openFolders$ ?? new ObservableSet<string>();
    this.openFolders$ = this._openFolders$.value$;
  }

  //<editor-fold desc="Open Folders">

  /**
   * Opens all folders in the given folder's path
   * @param folder - The starting point
   * @param includeFolder - If true the starting folder will also be expanded
   */
  openFolderPath(folder: TreeFolder<WithId, WithId>, includeFolder = false) {

    const folderIds = folder.path.map(x => x.model.id);

    if (includeFolder) {
      folderIds.push(folder.model.id);
    }

    this._openFolders$.addRange(folderIds);
  }

  /**
   * Open a list of folderIds
   * @param folders - FolderIds
   */
  openFolders(folders: string[]) {
    this._openFolders$.addRange(folders);
  }

  //</editor-fold>

  //<editor-fold desc="Close Folders">
  /**
   * Closes a folder and ensured that any open sub-folders are also closed
   * @param folder
   */
  closeFolder(folder: TreeFolder<WithId, WithId>) {
    this._openFolders$.modify(set => this._closeFolder(set, folder));
  }

  private _closeFolder(set: Set<string>, folder: TreeFolder<WithId, WithId>) {
    if (!set.delete(folder.model.id)) return;
    for (let f of folder.folders) {
      this._closeFolder(set, f);
    }
  }

  //</editor-fold>

  /**
   * Toggles the open state of a folder
   * When toggled on the entire path is also opened
   * @param folder - The folder to toggle
   * @param state - Force the added state (True: Always add, False: Always remove)
   */
  toggleOpenFolder(folder: TreeFolder<WithId, WithId>, state?: boolean) {
    if (this._openFolders$.has(folder?.model.id)) {
      if (state === true) return false;
      this.closeFolder(folder);
      return true;
    }

    if (state === false) return false;
    this.openFolderPath(folder, true);
    return true;
  }

  //<editor-fold desc="Open Item Folders">
  /**
   * Open all folders in path for item
   * @param item - The Item
   */
  openItemPath(item: TreeItem<WithId, WithId>) {
    const folderIds = item.folder.path.map(x => x.model.id);
    folderIds.push(item.folderId);
    this._openFolders$.addRange(folderIds);
  }

  //</editor-fold>

  //<editor-fold desc="Set Open Folders">
  /**
   * Overwrite the open folders to only include a single folder, and it's path
   * @param folder - The starting point
   * @param includeFolder - If true the starting folder will also be expanded
   */
  setOpenFolderPath(folder: TreeFolder<WithId, WithId> | undefined, includeFolder = false) {
    if (!folder) {
      this.closeFolders();
      return;
    }

    const folderIds = folder.path.map(x => x.model.id);

    if (includeFolder) {
      folderIds.push(folder.model.id);
    }

    this._openFolders$.set(folderIds);
  }

  /**
   * Overwrite the open folders to be the provided list
   * @param folders - Folders to set as open
   */
  setOpenFolders(folders: string[]) {
    this._openFolders$.set(folders);
  }

  //</editor-fold>

  /**
   * Close all folders
   */
  closeFolders() {
    this._openFolders$.clear();
  }

  /**
   * Generate an observable that indicates the open state of a specific folder
   * @param folderId - Folder
   */
  isOpen$(folderId: string) {
    return this.openFolders$.pipe(map(x => x.has(folderId)), distinctUntilChanged());
  }
}
