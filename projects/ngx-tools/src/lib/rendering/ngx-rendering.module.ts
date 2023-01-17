import {NgModule} from '@angular/core';
import {RenderOutletDirective} from "./directives/render-outlet.directive";

@NgModule({
  exports: [RenderOutletDirective],
  declarations: [RenderOutletDirective],
})
export class NgxRenderingModule {
}
