import {InjectionToken, StaticProvider} from "@angular/core";

export const BASE_OVERLAY_PROVIDERS = new InjectionToken<StaticProvider[]>('Providers injected at the root of overlays');
export const OVERLAY_ANIMATE_IN = new InjectionToken<boolean>('Indicate whether the element should animate in');
