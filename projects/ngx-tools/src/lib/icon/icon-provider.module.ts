import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {ICON_PROVIDER} from "./services/icon-provider.service";
import {IconProvider} from "./models/icon-providers";
import {IconService} from "./services/icon.service";

@NgModule({
  providers: [{provide: ICON_PROVIDER, useValue: IconProvider.Material}, IconService],
})
export class IconProviderModule {

  static WithFontAwesome(iconService?: Type<IconService>): ModuleWithProviders<IconProviderModule> {
    return {
      ngModule: IconProviderModule,
      providers: [{provide: ICON_PROVIDER, useValue: IconProvider.FontAwesome}, iconService ?? IconService]
    }
  }

  static WithMaterial(iconService?: Type<IconService>): ModuleWithProviders<IconProviderModule> {
    return {
      ngModule: IconProviderModule,
      providers: [{provide: ICON_PROVIDER, useValue: IconProvider.Material}, iconService ?? IconService]
    }
  }
}
