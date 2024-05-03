import {RenderTab} from "./render-tab";
import {NgxSideMenuTabContext} from "./menu-tab-context";
import {SideMenuOptions} from "./side-menu-options";
import {Signal} from "@angular/core";

export abstract class SideMenuRenderContext {

  abstract readonly zIndex: number;
  abstract readonly tab: Signal<RenderTab | undefined>;
  abstract readonly tabs: Signal<NgxSideMenuTabContext[]>;
  abstract readonly showButtons: Signal<boolean>;

  protected constructor(options: SideMenuOptions) {

  }

  abstract close(): void;

  abstract toggleTab(tab: NgxSideMenuTabContext): void;
}
