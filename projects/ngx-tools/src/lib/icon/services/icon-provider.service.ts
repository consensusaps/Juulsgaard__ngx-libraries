import {InjectionToken} from "@angular/core";
import {IconProvider, IconProviders} from "../models/icon-providers";

export const ICON_PROVIDER = new InjectionToken<IconProviders>(
  'Default Icon Provider',
  {
    providedIn: 'root',
    factory: () => IconProvider.Material
  }
);
