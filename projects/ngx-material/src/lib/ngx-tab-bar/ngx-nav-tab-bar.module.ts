import {RouterLink} from "@angular/router";
import {LazyNavTabDirective, NavTabDirective} from "./directives";
import {CommonModule} from "@angular/common";
import {TruthyPipe} from "@consensus-labs/ngx-tools";
import {NgModule} from "@angular/core";
import {NavTabBarComponent} from "./components";
import {MatTabsModule} from "@angular/material/tabs";


@NgModule({
  imports: [CommonModule, MatTabsModule, TruthyPipe, RouterLink],
  exports: [NavTabBarComponent, NavTabDirective, LazyNavTabDirective],
  declarations: [NavTabBarComponent, NavTabDirective, LazyNavTabDirective],
})
export class NgxNavTabBarModule {
}
