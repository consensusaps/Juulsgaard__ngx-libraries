import {Observable} from "rxjs";
import {RenderTab} from "./render-tab";
import {NgxSideMenuTabContext} from "./menu-tab-context";
import {SideMenuOptions} from "./side-menu-options";

export abstract class SideMenuRenderContext {

  abstract readonly zIndex: number;
  abstract readonly tab$: Observable<RenderTab | undefined>;
  abstract readonly tabs$: Observable<NgxSideMenuTabContext[]>;
  abstract readonly showButtons$: Observable<boolean>;

  protected constructor(options: SideMenuOptions) {

  }

  abstract close(): void;

  abstract toggleTab(tab: NgxSideMenuTabContext): void;
}
