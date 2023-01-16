import {ThemePalette} from "@angular/material/core";
import {Observable} from "rxjs";
import {Injector, TemplateRef} from "@angular/core";

export type DialogContext = TemplateDialogContext | StaticDialogContext;

interface SharedDialogContext {
  injector?: Injector;
  onClose?: () => any;
}

export interface TemplateDialogContext extends SharedDialogContext {
  header$: Observable<string>;
  withScroll$: Observable<boolean>;
  content$?: Observable<TemplateRef<void>>;
  footer$?: Observable<TemplateRef<void> | undefined>;
}

export interface StaticDialogContext extends SharedDialogContext {
  header: string;
  withScroll: boolean;
  description: string;
  isHtml: boolean;
  buttons: StaticDialogButton[];
}

export interface StaticDialogButton {
  text: string;
  color?: ThemePalette;
  callback: () => any;
}
