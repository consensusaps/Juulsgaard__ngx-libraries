import {NgModule} from '@angular/core';
import {NavTreeComponent} from "./components/nav-tree/nav-tree.component";
import {NavTreeFolderComponent} from "./components/nav-tree-folder/nav-tree-folder.component";
import {NavTreeFolderListComponent} from "./components/nav-tree-folder-list/nav-tree-folder-list.component";
import {NavTreeFolderPreviewComponent} from "./components/nav-tree-folder-preview/nav-tree-folder-preview.component";
import {NavTreeItemPreviewComponent} from "./components/nav-tree-item-preview/nav-tree-item-preview.component";
import {NavTreeItemComponent} from "./components/nav-tree-item/nav-tree-item.component";
import {CommonModule} from "@angular/common";
import {ContextMenuDirective, LoadingOverlayComponent} from "@consensus-labs/ngx-material";
import {FalsyPipe, LongTapDirective, NoClickBubbleDirective, TruthyPipe} from "@consensus-labs/ngx-tools";
import {MatRippleModule} from "@angular/material/core";
import {CdkDrag, CdkDragPreview, CdkDropList} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {NavTreeSearchComponent} from "./components/nav-tree-search/nav-tree-search.component";
import {NavTreeSearchResultComponent} from "./components/nav-tree-search-result/nav-tree-search-result.component";
import {TreeSearchActionsComponent} from "../components/tree-search-actions/tree-search-actions.component";
import {MatSortModule} from "@angular/material/sort";
import {RouterLink} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {NavSearchBarComponent} from "../../components/shared/nav-search-bar/nav-search-bar.component";
import {TableColumnComponent} from "../../components/shared/table-column/table-column.component";

@NgModule({
  imports: [
    CommonModule,
    LoadingOverlayComponent,
    TruthyPipe,
    MatRippleModule,
    MatTooltipModule,
    ContextMenuDirective,
    NoClickBubbleDirective,
    MatMenuModule,
    CdkDropList,
    FalsyPipe,
    CdkDrag,
    LongTapDirective,
    MatIconModule,
    NavSearchBarComponent,
    TreeSearchActionsComponent,
    MatTableModule,
    MatSortModule,
    TableColumnComponent,
    RouterLink,
    CdkDragPreview,
    NavSearchBarComponent,
    TableColumnComponent
  ],
  exports: [NavTreeComponent, NavTreeSearchComponent, NavTreeSearchResultComponent],
  declarations: [
    NavTreeComponent,
    NavTreeFolderComponent,
    NavTreeFolderListComponent,
    NavTreeFolderPreviewComponent,
    NavTreeItemPreviewComponent,
    NavTreeItemComponent,
    NavTreeSearchComponent,
    NavTreeSearchResultComponent
  ],
  providers: [],
})
export class NavTreeModule {
}
