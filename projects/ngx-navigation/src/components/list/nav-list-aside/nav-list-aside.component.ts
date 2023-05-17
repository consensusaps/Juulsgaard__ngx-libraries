import {Component, EventEmitter, HostBinding, Input, OnDestroy, Output} from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {CreateAction, ListData, ListDataSource} from "@consensus-labs/data-sources";
import {isString, WithId} from "@consensus-labs/ts-tools";
import {CommonModule} from "@angular/common";
import {ContextMenuDirective} from "@consensus-labs/ngx-material";
import {MatRippleModule} from "@angular/material/core";
import {hozCollapseAnimation, ImageFallbackDirective, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NavSearchBarComponent} from "../../shared/nav-search-bar/nav-search-bar.component";
import {NavPaginatorComponent} from "../../shared/nav-paginator/nav-paginator.component";
import {NavMenuItemComponent} from "../../shared/nav-menu-item/nav-menu-item.component";
import {NavListItemComponent} from "../nav-list-item/nav-list-item.component";
import {AsideService} from "../../../services/aside.service";

@Component({
  selector: 'ngx-nav-list-aside',
  templateUrl: './nav-list-aside.component.html',
  styleUrls: ['./nav-list-aside.component.scss'],
  animations: [hozCollapseAnimation()],
  standalone: true,
  imports: [
    CommonModule, NavSearchBarComponent, MatListModule, ContextMenuDirective, MatRippleModule,
    NoClickBubbleDirective, MatMenuModule, ImageFallbackDirective, MatTooltipModule, NavPaginatorComponent,
    NavMenuItemComponent, MatIconModule, NavListItemComponent
  ]
})
export class NavListAsideComponent<TModel extends WithId> implements OnDestroy {

  @HostBinding('class.cms-aside') aside = true;

  show$: Observable<boolean>;
  filter$: Observable<string|undefined>;

  constructor(
    breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private sidebarService: AsideService
  ) {
    const {breakpoint$, position$} = this.sidebarService.registerSidebar(this);

    this.show$ = breakpoint$.pipe(
      switchMap(width => breakpointObserver.observe(`(min-width: ${width}px)`)),
      map(x => x.matches)
    );

    this.filter$ = position$.pipe(
      map(depth => 0.98 - (depth * 0.02)),
      map(x => x ? `brightness(${x.toFixed(2)})` : undefined),
    );
  }

  ngOnDestroy() {
    this.sidebarService.unregisterSidebar(this);
  }

  @Input() routeNav: boolean|undefined|ActivatedRoute;
  @Input() showSearch = false;
  @Input() set activeItem(item: TModel|string|undefined) {
    this.activeId = !item ? undefined : isString(item) ? item : item.id;
  }
  activeId?: string;

  @Input() dataSource!: ListDataSource<TModel>;
  @Input() createActions: CreateAction[] = [];

  @Output() itemClick = new EventEmitter<TModel>();

  async rowClick(row: ListData<TModel>, event: MouseEvent) {
    if ((event as any).copiedId) return;
    this.itemClick.emit(row.model);

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      await this.router.navigate([row.id], {relativeTo: baseRoute});
    }
  }

  getId(index: number, item: WithId) {
    return item.id;
  }

}
