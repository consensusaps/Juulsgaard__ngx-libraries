import {inject, Injectable} from "@angular/core";
import {BaseUIScopeContext, UIScopeContext} from "../../../models/ui-scope";
import {map} from "rxjs/operators";
import {EMPTY} from "rxjs";

@Injectable()
export class TabBarUIScopeContext extends BaseUIScopeContext {
  constructor() {
    const context = inject(UIScopeContext, {skipSelf: true, optional: true});
    super(context?.childScope$.pipe(map(x => x.tabScope ?? x)) ?? EMPTY);
  }
}
