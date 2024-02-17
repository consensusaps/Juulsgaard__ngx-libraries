import {NgxSideMenuTabContext} from "./menu-tab-context";
import {Signal} from "@angular/core";

export abstract class NgxSideMenuContext {

  abstract tab: Signal<NgxSideMenuTabContext|undefined>;
  abstract tabs: Signal<NgxSideMenuTabContext[]>;
  abstract showButtons: Signal<boolean>;

  abstract openTab(slug: string): void;
  abstract close(): void;
  abstract toggleTab(tab: NgxSideMenuTabContext): void;
}
