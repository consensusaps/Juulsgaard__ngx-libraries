import {Disposable} from "@consensus-labs/ts-tools";
import {Rendering, TemplateRendering} from "@consensus-labs/ngx-tools";
import {NgxSideMenuTabContext} from "./menu-tab-context";

export class RenderTab implements Disposable {

  name?: string;
  content: TemplateRendering;

  constructor(tab: NgxSideMenuTabContext) {
    this.name = tab.name;
    this.content = Rendering.Static(tab.viewContainer, tab.templateRef);
  }

  dispose() {
    this.content.dispose();
  }

}
