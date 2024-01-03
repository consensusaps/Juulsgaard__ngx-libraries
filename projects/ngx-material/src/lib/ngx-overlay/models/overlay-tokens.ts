import {InjectionToken, StaticProvider} from "@angular/core";

export const BASE_OVERLAY_PROVIDERS = new InjectionToken<StaticProvider[]>('Base Providers injected at the root of overlays');
export const CUSTOM_OVERLAY_PROVIDERS = new InjectionToken<StaticProvider[]>('Additional Providers injected at the root of overlays');
export const OVERLAY_ANIMATE_IN = new InjectionToken<boolean>('Indicate whether the element should animate in');
