import {RouterLink} from "@angular/router";
import {NgxLazyTabDirective, NgxTabDirective} from "./directives";
import {CommonModule} from "@angular/common";
import {FalsyPipe, TruthyPipe} from "@consensus-labs/ngx-tools";
import {NgModule} from "@angular/core";
import {NgxTabBarComponent} from "./components";
import {MatTabsModule} from "@angular/material/tabs";


@NgModule({
  imports: [CommonModule, MatTabsModule, TruthyPipe, FalsyPipe, RouterLink],
  declarations: [NgxTabBarComponent, NgxTabDirective, NgxLazyTabDirective],
  exports: [NgxTabBarComponent, NgxTabDirective, NgxLazyTabDirective],
})
export class NgxNavTabBarModule {
}
