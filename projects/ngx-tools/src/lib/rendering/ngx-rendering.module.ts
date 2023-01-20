import {NgModule} from '@angular/core';
import {RenderOutletDirective} from "./directives/render-outlet.directive";
import {RenderSourceDirective} from "./directives/render-source.directive";

@NgModule({
  declarations: [RenderOutletDirective, RenderSourceDirective],
  exports: [RenderOutletDirective, RenderSourceDirective],
})
export class NgxRenderingModule {
}
