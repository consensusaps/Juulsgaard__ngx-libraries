import {Disposable} from "@juulsgaard/ts-tools";
import {Rendering, TemplateRendering} from "@juulsgaard/ngx-tools";
import {NgxSideMenuTabContext} from "./menu-tab-context";

export class RenderTab implements Disposable {

  name?: string;
  content: TemplateRendering;

  constructor(tab: NgxSideMenuTabContext) {
    this.name = tab.name();
    this.content = Rendering.FromSource.Static(tab.source());
  }

  dispose() {
    this.content.dispose();
  }

}
