import {ModuleWithProviders, NgModule, StaticProvider} from '@angular/core';
import {OverlayOutletDirective} from "./directives/overlay-outlet.directive";
import {RenderOverlayComponent} from "./components/render-overlay/render-overlay.component";
import {BASE_OVERLAY_PROVIDERS} from "./models/overlay-tokens";
import {IconDirective, NgxRenderingModule, TruthyPipe} from "@consensus-labs/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";

@NgModule({
  imports: [
    TruthyPipe,
    IconDirective,
    NgxRenderingModule,
    AsyncPipe,
    NgIf
  ],
  exports: [OverlayOutletDirective],
  declarations: [RenderOverlayComponent, OverlayOutletDirective],
  providers: [],
})
export class NgxOverlayOutletModule {
  public static WithBaseProviders(...providers: StaticProvider[]): ModuleWithProviders<NgxOverlayOutletModule> {
    return {
      ngModule: NgxOverlayOutletModule,
      providers: [{provide: BASE_OVERLAY_PROVIDERS, useValue: providers}]
    }
  }
}
