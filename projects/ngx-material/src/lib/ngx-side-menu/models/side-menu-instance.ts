import {Disposable} from "@consensus-labs/ts-tools";
import {Observable} from "rxjs";
import {RenderTab} from "./render-tab";
import {NgxSideMenuContext} from "./menu-context";
import {SideMenuOptions} from "./side-menu-options";
import {OverlayToken} from "@consensus-labs/ngx-tools";
import {Injector} from "@angular/core";
import {map} from "rxjs/operators";
import {cache, disposable} from "@consensus-labs/rxjs-tools";
import {NgxSideMenuTabContext} from "./menu-tab-context";

import {SideMenuRenderContext} from "./side-menu-render-context";

export class SideMenuInstance extends SideMenuRenderContext implements Disposable {

  get zIndex() {
    return this.token.zIndex
  }

  get tabs$() {
    return this.context.tabs$
  };

  get showButtons$() {
    return this.context.showButtons$
  };

  readonly tab$: Observable<RenderTab | undefined>;

  constructor(
    private context: NgxSideMenuContext,
    options: SideMenuOptions,
    private token: OverlayToken,
    readonly injector?: Injector
  ) {
    super(options);

    this.tab$ = this.context.tab$.pipe(
      map(x => x ? new RenderTab(x) : undefined),
      disposable(),
      cache()
    );
  }

  override close() {
    this.context.close();
  }

  toggleTab(tab: NgxSideMenuTabContext): void {
    this.context.toggleTab(tab);
  }

  dispose(): void {
    this.token.dispose();
  }
}
