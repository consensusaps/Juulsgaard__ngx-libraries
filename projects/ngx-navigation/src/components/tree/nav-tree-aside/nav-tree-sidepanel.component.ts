import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnDestroy, Output} from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {AnyTreeState, TreeFolder, TreeItem, TreeItemState} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {hozCollapseAnimation, NoClickBubbleDirective, TruthyPipe, WithIdDirective} from "@consensus-labs/ngx-tools";
import {AsideService} from "../../../services/aside.service";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ContextMenuDirective} from "@consensus-labs/ngx-material";
import {MatMenuModule} from "@angular/material/menu";
import {MatRippleModule} from "@angular/material/core";
import {NavListItemComponent} from "../../list/nav-list-item/nav-list-item.component";
import {NavMenuItemComponent} from "../../shared/nav-menu-item/nav-menu-item.component";

@Component({
  selector: 'cms-nav-tree-sidepanel',
  templateUrl: './nav-tree-sidepanel.component.html',
  styleUrls: ['./nav-tree-sidepanel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TruthyPipe,
    AsyncPipe,
    WithIdDirective,
    ContextMenuDirective,
    NgIf,
    NgClass,
    MatMenuModule,
    MatRippleModule,
    NoClickBubbleDirective,
    NavListItemComponent,
    NavMenuItemComponent,
    NgForOf
  ],
  providers: [LifetimeService],
  animations: [hozCollapseAnimation()]
})
// TODO: Rewrite to OnPush
export class NavTreeSidepanelComponent<TFolder extends WithId, TItem extends WithId> implements OnDestroy {

  @HostBinding('class.cms-aside') aside = true;

  show$: Observable<boolean>;
  filter$: Observable<string|undefined>;

  @Input() state?: AnyTreeState<TFolder, TItem>;
  @Input() routeNav: boolean | ActivatedRoute | undefined;

  @Output() folderClick = new EventEmitter<TFolder>();
  @Output() itemClick = new EventEmitter<TItem>();

  constructor(
    lifetime: LifetimeService,
    breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private asideService: AsideService
  ) {
    const {breakpoint$, position$} = this.asideService.registerSidebar(this);
    this.show$ = breakpoint$.pipe(
      switchMap(width => breakpointObserver.observe(`(min-width: ${width}px)`)),
      map(x => x.matches)
    );
    this.filter$ = position$.pipe(
      map(depth => depth < 1 ? undefined : 1 - (depth * 0.05)),
      map(x => x ? `brightness(${x.toFixed(2)})` : undefined),
    );
  }

  ngOnDestroy() {
    this.asideService.unregisterSidebar(this);
  }

  async onFolderClick(folder: TreeFolder<TFolder, TItem>|undefined) {

    if (!folder) return this.clearSelection()

    if (folder) this.folderClick.emit(folder.model);

    if (this.state instanceof TreeItemState) {

      this.state.setOnlyFolderId(folder.model.id);
      await this.clearSelection();

      return;
    }

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      await this.router.navigate([folder?.model.id ?? '.'], {relativeTo: baseRoute});
      return;
    }

    this.state?.setFolder(folder);
    return;
  }

  async clearSelection() {

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      await this.router.navigate(['.'], {relativeTo: baseRoute});
      return;
    }

    this.state?.setFolder(undefined);
  }

  async onItemClick(item: TreeItem<TFolder, TItem>) {

    this.itemClick.emit(item.model);

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      const route = this.state instanceof TreeItemState ? [item.model.id] : [item.folderId, item.model.id];

      await this.router.navigate(
        route,
        {relativeTo: baseRoute, queryParamsHandling: 'preserve'}
      );
      return;
    }

    this.state?.setItem(item);
  }

  getId(index: number, item: {model: {model: WithId}}) {
    return item.model.model.id;
  }
}
