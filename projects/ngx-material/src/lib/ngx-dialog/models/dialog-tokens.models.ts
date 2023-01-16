import {InjectionToken} from "@angular/core";
import {DialogContext} from "./dialog-context.models";

export const DIALOG_CONTEXT = new InjectionToken<DialogContext>('Content for a Render Dialog');
export const DIALOG_Z_INDEX = new InjectionToken<number | undefined>('Z-index for Render Dialog');
