import {NgModule, Provider, StaticProvider} from '@angular/core';
import {RenderOverlayComponent} from './components/render-overlay/render-overlay.component';
import {OverlayDirective} from "./directives/overlay.directive";
import {CommonModule} from "@angular/common";
import {IconDirective, NgxRenderingModule, TruthyPipe} from "@consensus-labs/ngx-tools";
import {BASE_OVERLAY_PROVIDERS} from "./models/overlay-tokens";

@NgModule({
  imports: [
    CommonModule,
    TruthyPipe,
    IconDirective,
    NgxRenderingModule
  ],
  declarations: [
    RenderOverlayComponent,
    OverlayDirective
  ],
  exports: [
    OverlayDirective
  ]
})
export class NgxOverlayModule {

  public static ProvideBaseProviders(...providers: StaticProvider[]): Provider {
    return {provide: BASE_OVERLAY_PROVIDERS, useValue: providers};
  }

}
