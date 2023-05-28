import {NgModule} from '@angular/core';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {SideMenuTabComponent} from './components/side-menu-tab/side-menu-tab.component';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBadgeModule} from "@angular/material/badge";
import {IconDirective, NgxRenderingModule, TruthyPipe} from "@consensus-labs/ngx-tools";
import {RenderSideMenuComponent} from './components/render-side-menu/render-side-menu.component';
import {MatRippleModule} from "@angular/material/core";
import {SideMenuTabDirective} from "./directives/side-menu-tab.directive";
import {IconButtonComponent} from "../../components/icon-button/icon-button.component";

@NgModule({
  imports: [CommonModule, MatTooltipModule, MatBadgeModule, IconDirective, NgxRenderingModule, TruthyPipe, MatRippleModule, IconButtonComponent],
  declarations: [
    SideMenuComponent,
    SideMenuTabComponent,
    SideMenuTabDirective,
    RenderSideMenuComponent,
  ],
  exports: [
    SideMenuComponent,
    SideMenuTabDirective,
    SideMenuTabComponent
  ],
})
export class NgxSideMenuModule {
}
