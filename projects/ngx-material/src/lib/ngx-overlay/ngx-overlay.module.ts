import {ModuleWithProviders, NgModule, StaticProvider} from '@angular/core';
import {RenderOverlayComponent} from './components/render-overlay/render-overlay.component';
import {OverlayOutletDirective} from "./directives/overlay-outlet.directive";
import {OverlayDirective} from "./directives/overlay.directive";
import {BASE_OVERLAY_PROVIDERS} from "./models/overlay-tokens.models";
import {CommonModule} from "@angular/common";
import {IconDirective, NgxRenderingModule, TruthyPipe} from "@consensus-labs/ngx-tools";

@NgModule({
  imports: [
    CommonModule,
    TruthyPipe,
    IconDirective,
    NgxRenderingModule
  ],
  declarations: [
    RenderOverlayComponent,
    OverlayOutletDirective,
    OverlayDirective
  ],
  exports: [
    OverlayOutletDirective,
    OverlayDirective
  ],
  providers: [],
})
export class NgxOverlayModule {

  public static WithBaseProviders(...providers: StaticProvider[]): ModuleWithProviders<NgxOverlayModule> {
    return {
      ngModule: NgxOverlayModule,
      providers: [{provide: BASE_OVERLAY_PROVIDERS, useValue: providers}]
    }
  }

}
