import {Provider, StaticProvider} from "@angular/core";
import {CUSTOM_OVERLAY_PROVIDERS} from "./overlay-tokens";

export class NgxOverlayProviders {
  static Provide(providers: StaticProvider[]): Provider {
    return {provide: CUSTOM_OVERLAY_PROVIDERS, useValue: providers};
  }
}
