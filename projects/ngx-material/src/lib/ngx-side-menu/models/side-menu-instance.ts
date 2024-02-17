import {Disposable} from "@juulsgaard/ts-tools";
import {RenderTab} from "./render-tab";
import {NgxSideMenuContext} from "./menu-context";
import {SideMenuOptions} from "./side-menu-options";
import {handleDisposableSignal, OverlayToken} from "@juulsgaard/ngx-tools";
import {computed, Injector, Signal} from "@angular/core";
import {NgxSideMenuTabContext} from "./menu-tab-context";

import {SideMenuRenderContext} from "./side-menu-render-context";

export class SideMenuInstance extends SideMenuRenderContext implements Disposable {

  override zIndex: number;
  override tabs: Signal<NgxSideMenuTabContext[]>;
  override showButtons: Signal<boolean>;
  override tab: Signal<RenderTab | undefined>;

  constructor(
    private context: NgxSideMenuContext,
    options: SideMenuOptions,
    private token: OverlayToken,
    readonly injector?: Injector
  ) {
    super(options);

    this.zIndex = token.zIndex;
    this.tabs = this.context.tabs;
    this.showButtons = this.context.showButtons;

    this.tab = computed(() => {
      const tab = this.context.tab();
      if (!tab) return undefined;
      return new RenderTab(tab);
    });

    handleDisposableSignal(this.tab);
  }

  override close() {
    this.context.close();
  }

  override toggleTab(tab: NgxSideMenuTabContext): void {
    this.context.toggleTab(tab);
  }

  dispose(): void {
    this.token.dispose();
  }
}
