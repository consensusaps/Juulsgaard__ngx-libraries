import {RouterLink} from "@angular/router";
import {NgxLazyTabDirective, NgxTabDirective} from "./directives";
import {CommonModule} from "@angular/common";
import {FalsyPipe, TruthyPipe} from "@juulsgaard/ngx-tools";
import {NgModule} from "@angular/core";
import {NgxTabBarComponent} from "./components";
import {MatTabsModule} from "@angular/material/tabs";
import {UiHeaderDirective, UiWrapperDirective} from "../../directives";


@NgModule({
  imports: [CommonModule, MatTabsModule, TruthyPipe, FalsyPipe, RouterLink, UiWrapperDirective, UiHeaderDirective],
  declarations: [NgxTabBarComponent, NgxTabDirective, NgxLazyTabDirective],
  exports: [NgxTabBarComponent, NgxTabDirective, NgxLazyTabDirective],
})
export class NgxNavTabBarModule {
}
