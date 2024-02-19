import {inject, Injectable} from "@angular/core";
import {BaseUIScopeContext, UIScopeContext} from "../../../models/ui-scope";

@Injectable()
export class TabBarUIScopeContext extends BaseUIScopeContext {
  constructor() {
    const context = inject(UIScopeContext, {skipSelf: true});
    super(context, {tabScope: true});
  }
}
