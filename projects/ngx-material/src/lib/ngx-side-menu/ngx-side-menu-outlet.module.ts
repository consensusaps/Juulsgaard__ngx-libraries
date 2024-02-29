import {NgModule} from '@angular/core';
import {NgxSideMenuOutletDirective} from "./directives/side-menu-outlet.directive";
import {RenderSideMenuComponent} from "./components/render-side-menu/render-side-menu.component";
import {FalsyPipe, IconDirective, NgxRenderingModule, TruthyPipe} from "@juulsgaard/ngx-tools";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTooltipModule} from "@angular/material/tooltip";
import {IconButtonComponent} from "../buttons/components/icon-button/icon-button.component";

@NgModule({
  imports: [
    IconDirective,
    IconButtonComponent,
    NgIf,
    NgForOf,
    MatBadgeModule,
    MatTooltipModule,
    TruthyPipe,
    FalsyPipe,
    NgxRenderingModule,
    AsyncPipe
  ],
  exports: [NgxSideMenuOutletDirective],
  declarations: [NgxSideMenuOutletDirective, RenderSideMenuComponent],
  providers: [],
})
export class NgxSideMenuOutletModule {
}
