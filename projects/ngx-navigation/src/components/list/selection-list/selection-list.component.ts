import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CreateAction} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {CommonModule} from "@angular/common";
import {ContextMenuDirective, LoadingOverlayComponent} from "@consensus-labs/ngx-material";
import {MatRippleModule} from "@angular/material/core";
import {ImageFallbackDirective, NoClickBubbleDirective, TruthyPipe} from "@consensus-labs/ngx-tools";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NavSearchBarComponent} from "../../shared/nav-search-bar/nav-search-bar.component";
import {NavMenuItemComponent} from "../../shared/nav-menu-item/nav-menu-item.component";
import {NavPaginatorComponent} from "../../shared/nav-paginator/nav-paginator.component";
import {NavListItemComponent} from "../nav-list-item/nav-list-item.component";
import {SelectionListContext} from "../../../models/selection-list-context";

@Component({
  selector: 'ngx-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NavSearchBarComponent,
    ContextMenuDirective,
    MatListModule,
    MatRippleModule,
    NoClickBubbleDirective,
    MatMenuModule,
    MatTooltipModule,
    NavMenuItemComponent,
    NavPaginatorComponent,
    LoadingOverlayComponent,
    ImageFallbackDirective,
    MatIconModule,
    MatCheckboxModule,
    TruthyPipe,
    NavListItemComponent
  ]
})
export class SelectionListComponent<TModel extends WithId> extends SelectionListContext<TModel> {
  @Input() loading?: boolean;
  @Input() showSearch?: boolean;
  @Input() createActions: CreateAction[] = [];

  constructor() {
    super();
  }
}
