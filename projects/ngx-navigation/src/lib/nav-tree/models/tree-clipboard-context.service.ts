import {inject, Injectable} from "@angular/core";
import {ObservableSet} from "@consensus-labs/rxjs-tools";
import {auditTime, combineLatest, Observable} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";

@Injectable()
export class TreeClipboardContext {

  _folderSelection$: ObservableSet<string>;
  folderSelection$: Observable<ReadonlySet<string>>;

  _folderClipboard$: ObservableSet<string>;
  folderClipboard$: Observable<ReadonlySet<string>>;
  get folderClipboard() {return this._folderClipboard$.value};

  _itemSelection$: ObservableSet<string>;
  itemSelection$: Observable<ReadonlySet<string>>;

  _itemClipboard$: ObservableSet<string>;
  itemClipboard$: Observable<ReadonlySet<string>>;
  get itemClipboard() {return this._itemClipboard$.value};

  selectionEmpty$: Observable<boolean>;
  clipboardEmpty$: Observable<boolean>;

  constructor() {
    const parentContext = inject(TreeClipboardContext, {skipSelf: true, optional: true});
    this._folderSelection$ = parentContext?._folderSelection$ ?? new ObservableSet<string>();
    this.folderSelection$ = this._folderSelection$.value$;
    this._folderClipboard$ = parentContext?._folderClipboard$ ?? new ObservableSet<string>();
    this.folderClipboard$ = this._folderClipboard$.value$;
    this._itemSelection$ = parentContext?._itemSelection$ ?? new ObservableSet<string>();
    this.itemSelection$ = this._itemSelection$.value$;
    this._itemClipboard$ = parentContext?._itemClipboard$ ?? new ObservableSet<string>();
    this.itemClipboard$ = this._itemClipboard$.value$;

    this.selectionEmpty$ = combineLatest([this._folderSelection$.size$, this._itemSelection$.size$]).pipe(
      auditTime(0),
      map(([folderSize, itemSize]) => folderSize < 1 && itemSize < 1),
      distinctUntilChanged()
    );

    this.clipboardEmpty$ = combineLatest([this._folderClipboard$.size$, this._itemClipboard$.size$]).pipe(
      auditTime(0),
      map(([folderSize, itemSize]) => folderSize < 1 && itemSize < 1),
      distinctUntilChanged()
    );
  }

  //<editor-fold desc="Clipboard Folders">
  /**
   * Mark a folder as selected
   * @param id - If of the Folder
   * @param add - Optionally force add / remove
   */
  toggleFolderSelection(id: string, add?: boolean) {
    this._folderSelection$.toggle(id, add);
  }

  /**
   * Move selected folders to clipboard
   */
  cutFolders() {
    if (this._folderSelection$.size < 1) return false;
    this._folderClipboard$.set(this._folderSelection$.array);
    this._folderSelection$.clear();
    return true;
  }

  manualCutFolders(...folderIds: string[]) {
    this._folderClipboard$.set(folderIds);
    this._itemClipboard$.clear();
  }

  folderSelected$(folderId: string) {
    return this.folderSelection$.pipe(
      map(x => x.has(folderId)),
      distinctUntilChanged()
    );
  }

  folderInClipboard$(folderId: string) {
    return this.folderClipboard$.pipe(
      map(x => x.has(folderId)),
      distinctUntilChanged()
    );
  }

  clearFolderClipboard() {
    this._folderClipboard$.clear();
  }

  //</editor-fold>

  //<editor-fold desc="Clipboard items">
  /**
   * Mark an Item as selected
   * @param id - Id of the Item
   * @param add - Optionally force add / remove
   */
  toggleItemSelection(id: string, add?: boolean) {
    this._itemSelection$.toggle(id, add);
  }

  /**
   * Move selected items to clipboard
   */
  cutItems() {
    if (this._itemSelection$.size < 1) return false;
    this._itemClipboard$.set(this._itemSelection$.array);
    this._itemSelection$.clear();
    return true;
  }

  manualCutItems(...itemIds: string[]) {
    this._itemClipboard$.set(itemIds);
    this._folderClipboard$.clear();
  }

  itemSelected$(itemId: string) {
    return this.itemSelection$.pipe(
      map(x => x.has(itemId)),
      distinctUntilChanged()
    );
  }

  itemInClipboard$(itemId: string) {
    return this.itemClipboard$.pipe(
      map(x => x.has(itemId)),
      distinctUntilChanged()
    );
  }

  clearItemClipboard() {
    this._itemClipboard$.clear();
  }

  //</editor-fold>

  clearSelection() {
    this._folderSelection$.clear();
    this._itemSelection$.clear();
  }

  clearClipboard() {
    this._folderClipboard$.clear();
    this._itemClipboard$.clear();
  }
}
