import {NgModule} from '@angular/core';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {SideMenuTabComponent} from './components/side-menu-tab/side-menu-tab.component';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBadgeModule} from "@angular/material/badge";
import {SideMenuTabDirective} from "./directives/side-menu-tab.directive";
import {FalsyPipe, NgxRenderingModule, TruthyPipe} from "@juulsgaard/ngx-tools";
import {MonoSideMenuComponent} from "./components/mono-side-menu/mono-side-menu.component";
import {IconButtonComponent} from "../buttons/components/icon-button/icon-button.component";

@NgModule({
  imports: [
    CommonModule, MatTooltipModule, MatBadgeModule, IconButtonComponent, TruthyPipe, FalsyPipe,
    NgxRenderingModule
  ],
  declarations: [
    SideMenuComponent,
    MonoSideMenuComponent,
    SideMenuTabComponent,
    SideMenuTabDirective,
  ],
  exports: [
    SideMenuComponent,
    MonoSideMenuComponent,
    SideMenuTabDirective,
    SideMenuTabComponent
  ],
})
export class NgxSideMenuModule {
}
