import {EventEmitter, inject, Injectable, OnInit} from "@angular/core";
import {WithId} from "@consensus-labs/ts-tools";
import {ActivatedRoute, Router} from "@angular/router";
import {AnyTreeState, TreeFolder, TreeItem, TreeItemState, TreeState} from "@consensus-labs/data-sources";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {latestValueFromOrDefault} from "@consensus-labs/rxjs-tools";
import {TreeClipboardContext} from "./tree-clipboard-context.service";
import {BaseTreeContext} from "../../../models/base-tree-context";
import {MoveModel} from "../../../models/move";


@Injectable()
export abstract class NavTreeContext<TFolder extends WithId, TItem extends WithId> extends BaseTreeContext<TFolder, TItem> implements OnInit {

  protected abstract folderClick: EventEmitter<TFolder>;
  protected abstract itemClick: EventEmitter<TItem>;

  protected abstract routeNav: boolean | ActivatedRoute | undefined;
  protected abstract externalState?: AnyTreeState<TFolder, TItem>;

  protected state!: AnyTreeState<TFolder, TItem>;

  public readonly clipboard: TreeClipboardContext;

  public showPasteFolders$!: Observable<boolean>;
  public showPasteItems$!: Observable<boolean>;
  public allowMoveFolder$!: Observable<boolean>;
  public allowMoveItem$!: Observable<boolean>;

  public canMoveFolder = false;
  public canMoveItem = false;
  public canRelocateFolder = false;
  public canRelocateItem = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected constructor() {
    super();
    this.clipboard = inject(TreeClipboardContext, {optional: true, skipSelf: true}) ?? new TreeClipboardContext();
  }

  ngOnInit() {

    if (!this.dataSource) {
      console.error('Datasource is required for Nav Trees');
      return;
    }

    this.canMoveFolder = !!this.dataSource.onFolderMove;
    this.canRelocateFolder = !!this.dataSource.onFolderRelocate;
    this.canMoveItem = !!this.dataSource.onItemMove;
    this.canRelocateItem = !!this.dataSource.onItemRelocate;

    this.state = this.externalState ?? new TreeState(this.dataSource);

    this.showPasteFolders$ = !this.canRelocateFolder
      ? of(false)
      : this.clipboard.folderClipboard$.pipe(map(x => !!x.size));

    this.showPasteItems$ = !this.canRelocateItem
      ? of(false)
      : this.clipboard.itemSelection$.pipe(map(x => !!x.size));

    this.allowMoveFolder$ = this.dataSource.canMoveFolder$;
    this.allowMoveItem$ = this.dataSource.canMoveItem$;
  }

  folderActive$(folderId: string) {
    return this.state.folderActive$(folderId);
  }

  itemActive$(itemId: string) {
    return this.state.itemActive$(itemId);
  }

  async clickFolder(folder: TreeFolder<TFolder, TItem>) {

    this.folderClick.emit(folder.model);

    const currentFolderId = latestValueFromOrDefault(this.state.folderId$);
    const clickedCurrentFolder = currentFolderId && currentFolderId === folder.model.id;

    this.folderState.toggleOpenFolder(folder, clickedCurrentFolder ? undefined : true);

    if (this.routeNav) {
      if (this.state instanceof TreeItemState) this.state.setOnlyFolderId(folder.model.id);

      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      const route = this.state instanceof TreeState ? [folder.model.id] : ['.'];
      await this.router.navigate(route, {relativeTo: baseRoute});
      return;
    }

    this.state.setFolder(folder);
    return;
  }

  async clickItem(item: TreeItem<TFolder, TItem>) {

    this.itemClick.emit(item.model);

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      const route = this.state instanceof TreeState ? [item.folderId, item.model.id] : [item.model.id];

      await this.router.navigate(
        route,
        {relativeTo: baseRoute, queryParamsHandling: 'preserve'}
      );
      return;
    }

    this.state.setItem(item);
  }

  protected abstract onPaste(folder?: TreeFolder<TFolder, TItem>): Promise<boolean>;

  paste(folder: TreeFolder<TFolder, TItem>) {
    return this.onPaste(folder);
  }

  async moveItem(item: MoveModel) {
    this.dataSource.onItemMove?.(item);
  }

  async moveFolder(folder: MoveModel) {
    this.dataSource.onFolderMove?.(folder);
  }
}
