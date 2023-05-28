import {NgModule} from '@angular/core';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {SideMenuTabComponent} from './components/side-menu-tab/side-menu-tab.component';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBadgeModule} from "@angular/material/badge";
import {SideMenuTabDirective} from "./directives/side-menu-tab.directive";
import {IconButtonComponent} from "../../components";
import {TruthyPipe} from "@consensus-labs/ngx-tools";

@NgModule({
  imports: [CommonModule, MatTooltipModule, MatBadgeModule, IconButtonComponent, TruthyPipe],
  declarations: [
    SideMenuComponent,
    SideMenuTabComponent,
    SideMenuTabDirective,
  ],
  exports: [
    SideMenuComponent,
    SideMenuTabDirective,
    SideMenuTabComponent
  ],
})
export class NgxSideMenuModule {
}
