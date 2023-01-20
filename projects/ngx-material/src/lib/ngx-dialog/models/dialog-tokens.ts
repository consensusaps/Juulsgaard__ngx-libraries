import {InjectionToken} from "@angular/core";
import {DialogContext} from "./dialog-context";

export const DIALOG_CONTEXT = new InjectionToken<DialogContext>('Content for a Render Dialog');
export const DIALOG_ANIMATE_IN = new InjectionToken<boolean>('Indicate whether the element should animate in');
