import {
  ChangeDetectionStrategy, Component, EventEmitter, HostBinding, inject, Input, NgZone, Output
} from '@angular/core';
import {combineLatest, filter, firstValueFrom, fromEvent, of, Subscription} from "rxjs";
import {first, map, switchMap} from "rxjs/operators";
import {AnyTreeState, TreeDataSource, TreeFolder} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {ActivatedRoute} from "@angular/router";
import {Dispose} from "@consensus-labs/ngx-tools";
import {NavTreeContext} from "../../models/nav-tree-context";
import {TreeFolderContext} from "../../models/tree-folder-context.service";
import {TreeClipboardContext} from "../../models/tree-clipboard-context.service";
import {SnackbarService} from "@consensus-labs/ngx-material";
import {NavTreeActionsComponent} from "../nav-tree-actions/nav-tree-actions.component";

@Component({
  selector: 'ngx-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: NavTreeContext, useExisting: NavTreeComponent},
    {provide: TreeFolderContext, useFactory: () => inject(NavTreeContext).folderState, deps: [NavTreeContext]},
    {provide: TreeClipboardContext, useFactory: () => inject(NavTreeContext).clipboard, deps: [NavTreeContext]},
  ]
})
export class NavTreeComponent<TFolder extends WithId, TItem extends WithId> extends NavTreeContext<TFolder, TItem> {

  @HostBinding('class.ngx-nav-tree') treeClass = true;

  @Input() dataSource!: TreeDataSource<TFolder, TItem>;

  @Output() folderClick = new EventEmitter<TFolder>();
  @Output() itemClick = new EventEmitter<TItem>();

  @Input() routeNav: boolean | ActivatedRoute | undefined;
  @Input('state') externalState?: AnyTreeState<TFolder, TItem>;

  @Input() loading?: boolean;
  @Input() actions?: NavTreeActionsComponent;

  @Input() set expandAll(expand: boolean) {
    this._expandAll$.next(expand);
  }

  @Input() set hideEmpty(hide: boolean) {
    this._hideEmpty$.next(hide);
  }

  @Dispose sub = new Subscription();
  private snacks = inject(SnackbarService, {optional: true});

  constructor(zone: NgZone) {
    super();

    // Register shortcuts outside Zone
    zone.runOutsideAngular(() => {
      this.sub.add(fromEvent<KeyboardEvent>(window, 'keydown').pipe(
        filter(e => e.metaKey || e.ctrlKey)
      ).subscribe(async e => {
        switch (e.key) {
          case 'x':
            await zone.run(() => this.onCut());
            break;
          case 'v':
            await zone.run(() => this.onPaste());
            break;
        }
      }))
    })
  }

  override ngOnInit() {
    super.ngOnInit();

    // Open current folder on first render
    this.sub.add(this.state.folderId$.pipe(first()).subscribe(async folderId => {
      if (!folderId) return;
      await this.openFolderIdPath(folderId, true);
    }));

    this.setupActions();
  }

  //<editor-fold desc="Setup">

  private setupActions() {
    if (!this.actions) return;

    // TODO: Rewrite to be OnPush compliant
    const actions = this.actions;

    //<editor-fold desc="State">
    this.sub.add(this.clipboard.selectionEmpty$.subscribe(empty => actions.showClearSelection = !empty));
    this.sub.add(this.clipboard.clipboardEmpty$.subscribe(empty => actions.showClearClipboard = !empty));

    // Cut Validation
    const canCutFolders$ = !this.canRelocateFolder
      ? of(false)
      : this.clipboard.folderSelection$.pipe(map(x => !!x.size));

    const canCutItems$ = !this.canRelocateItem
      ? of(false)
      : this.clipboard.itemSelection$.pipe(map(x => !!x.size));

    this.sub.add(
      combineLatest([canCutFolders$, canCutItems$])
        .subscribe(([a, b]) => actions.showCut = a || b)
    );

    // Paste validation
    const canPasteFolders$ = !this.canRelocateFolder
      ? of(false)
      : this.clipboard.folderClipboard$.pipe(map(x => !!x.size));

    const canPasteItems$ = !this.canRelocateItem
      ? of(false)
      : this.clipboard.itemClipboard$.pipe(
        map(x => !!x.size),
        switchMap(b => !b ? of(false) : this.state!.baseFolder$.pipe(map(x => !!x)))
      );

    this.sub.add(
      combineLatest([canPasteFolders$, canPasteItems$])
        .subscribe(([a, b]) => actions.showPaste = a || b)
    );
    //</editor-fold>

    //<editor-fold desc="Actions">
    this.sub.add(actions.paste.subscribe(() => this.onPaste()));
    this.sub.add(actions.cut.subscribe(() => this.onCut()));

    this.sub.add(actions.clearSelection.subscribe(() => this.clipboard.clearSelection()));
    this.sub.add(actions.clearClipboard.subscribe(() => this.clipboard.clearClipboard()));
    //</editor-fold>
  }

  //</editor-fold>

  //<editor-fold desc="Cut Action">
  private async onCut() {

    const cutFolders = this.canRelocateFolder && this.clipboard.cutFolders();
    const cutItems = this.canRelocateItem && this.clipboard.cutItems();

    if (cutFolders || cutItems) return true;

    if (this.canRelocateItem) {
      const item = await firstValueFrom(this.state!.baseItem$);
      if (item) {
        this.clipboard.manualCutItems(item.model.id);
        return true;
      }
    }

    if (this.canRelocateFolder) {
      const folder = await firstValueFrom(this.state!.baseFolder$);
      if (folder) {
        this.clipboard.manualCutFolders(folder.model.id);
        return true;
      }
    }

    return false;
  }

  //</editor-fold>

  //<editor-fold desc="Paste Action">
  pasting = false;

  protected override async onPaste(folder?: TreeFolder<TFolder, TItem>): Promise<boolean> {

    if (this.pasting) return false;
    this.pasting = true;

    const folders = this.clipboard.folderClipboard;
    const canPasteFolders = this.canRelocateFolder && !!folders.size;

    const items = this.clipboard.itemClipboard;
    const canPasteItems = this.canRelocateItem && !!items.size;

    if (!canPasteFolders && !canPasteItems) return false;

    if (folder === undefined) {
      folder = await firstValueFrom(this.state!.metaFolder$);

      // A folder is needed for item paste, and folder paste isn't activated
      if (folder === undefined && !canPasteFolders) {
        this.pasting = false;
        return false;
      }
    }

    if (canPasteFolders) {
      await this.pasteFolders(folder, folders);
    }

    if (canPasteItems && folder) {
      await this.pasteItems(folder, items);
    }

    this.pasting = false;

    return canPasteFolders || canPasteItems;
  }

  private async pasteFolders(folder: TreeFolder<TFolder, TItem> | undefined, folders: ReadonlySet<string>) {

    if (folder && folders.has(folder.model.id)) {
      this.snacks?.error(`Can't move folder inside of itself`);
      return false;
    }

    for (let parent of folder?.path ?? []) {
      if (folders.has(parent.model.id)) {
        this.snacks?.error(`Can't move folder to sub-folder`);
        return false;
      }
    }

    try {
      await this.dataSource.onFolderRelocate?.({ids: Array.from(folders), parentId: folder?.model.id});
      this.clipboard.clearFolderClipboard();
      return true;
    } catch {
      return false;
    }
  }

  private async pasteItems(folder: TreeFolder<TFolder, TItem>, items: ReadonlySet<string>) {
    try {
      await this.dataSource.onItemRelocate?.({ids: Array.from(items), parentId: folder.model.id});
      this.clipboard.clearItemClipboard();
      return true;
    } catch {
      return false;
    }
  }

  //</editor-fold>
}
