import {inject, Injectable} from "@angular/core";
import {BaseUIScopeContext} from "../../../models/ui-scope";
import {TabBarUIScopeContext} from "./tab-bar-ui-scope.context";

@Injectable()
export class TabPanelUIScopeContext extends BaseUIScopeContext {
  constructor() {
    const context = inject(TabBarUIScopeContext, {self: true});
    super(context);
  }
}
