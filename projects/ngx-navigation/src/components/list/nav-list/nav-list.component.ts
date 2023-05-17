import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {isString, WithId} from "@consensus-labs/ts-tools";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ContextMenuDirective, LoadingOverlayComponent} from "@consensus-labs/ngx-material";
import {MatRippleModule} from "@angular/material/core";
import {MatMenuModule} from "@angular/material/menu";
import {NavPaginatorComponent} from "../../shared/nav-paginator/nav-paginator.component";
import {NavMenuItemComponent} from "../../shared/nav-menu-item/nav-menu-item.component";
import {NavListItemComponent} from "../nav-list-item/nav-list-item.component";
import {NavSearchBarComponent} from "../../shared/nav-search-bar/nav-search-bar.component";
import {CreateAction, ListData, ListDataSource} from "@consensus-labs/data-sources";
import {ActivatedRoute, Router} from "@angular/router";
import {WithIdDirective} from "@consensus-labs/ngx-tools";

@Component({
    selector: 'ngx-nav-list',
    templateUrl: './nav-list.component.html',
    styleUrls: ['./nav-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NavSearchBarComponent,
        NgForOf,
        NgIf,
        MatRippleModule,
        NgClass,
        ContextMenuDirective,
        AsyncPipe,
        NavListItemComponent,
        MatMenuModule,
        NavMenuItemComponent,
        NavPaginatorComponent,
        LoadingOverlayComponent,
        WithIdDirective
    ]
})
export class NavListComponent<TModel extends WithId> {

    @Input() routeNav: boolean|undefined|ActivatedRoute;
    @Input() loading?: boolean;
    @Input() showSearch?: boolean;

    @Input() dataSource!: ListDataSource<TModel>;
    @Input() createActions: CreateAction[] = [];

    @Output() itemClick = new EventEmitter<TModel>();

    @Input() set activeItem(item: TModel|string|null|undefined) {
        this.activeId = !item ? undefined : isString(item) ? item : item.id;
    }
    activeId?: string;

    constructor(private router: Router, private route: ActivatedRoute) { }

    async rowClick(row: ListData<TModel>, event: MouseEvent) {

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
