import {NgModule} from '@angular/core';
import {NgxSideMenuOutletDirective} from "./directives/side-menu-outlet.directive";
import {RenderSideMenuComponent} from "./components/render-side-menu/render-side-menu.component";
import {IconDirective, NgxRenderingModule, TruthyPipe} from "@consensus-labs/ngx-tools";
import {IconButtonComponent} from "../../components";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  imports: [
    IconDirective,
    IconButtonComponent,
    NgIf,
    NgForOf,
    MatBadgeModule,
    MatTooltipModule,
    TruthyPipe,
    NgxRenderingModule,
    AsyncPipe
  ],
  exports: [NgxSideMenuOutletDirective],
  declarations: [NgxSideMenuOutletDirective, RenderSideMenuComponent],
  providers: [],
})
export class NgxSideMenuOutletModule {
}
