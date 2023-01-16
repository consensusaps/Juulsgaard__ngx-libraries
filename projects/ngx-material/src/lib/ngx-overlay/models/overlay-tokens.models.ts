import {InjectionToken, StaticProvider} from "@angular/core";
import {OverlayContext} from "./overlay-context.models";

export const OVERLAY_CONTEXT = new InjectionToken<OverlayContext>('Config for overlay');
export const BASE_OVERLAY_PROVIDERS = new InjectionToken<StaticProvider[]>('Providers injected at the root of overlays');
export const OVERLAY_Z_INDEX = new InjectionToken<number|undefined>('A custom Z index for an overlay');
export const OVERLAY_ANIMATE_IN = new InjectionToken<boolean>('Indicate whether the element should animate in');
