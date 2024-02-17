import {NgModule} from '@angular/core';
import {RenderOutletDirective, TemplateRenderDirective} from "./directives/render-outlet.directive";
import {RenderSourceDirective} from "./directives/render-source.directive";

@NgModule({
  declarations: [RenderOutletDirective, TemplateRenderDirective, RenderSourceDirective],
  exports: [RenderOutletDirective, TemplateRenderDirective, RenderSourceDirective],
})
export class NgxRenderingModule {
}
