import {inject, Injectable} from '@angular/core';
import {BaseUIScopeContext} from "../../../models/ui-scope";
import {distinctUntilChanged, switchMap} from "rxjs";
import {NgxTabContext} from "./ngx-tab.context";
import {TabPanelUIScopeContext} from "./tab-panel-ui-scope.context";

@Injectable()
export class TabUIScopeContext extends BaseUIScopeContext {
  constructor() {
    const tabContext = inject(NgxTabContext, {self: true});
    const context = inject(TabPanelUIScopeContext);
    const scope$ = tabContext.isActive$.pipe(
      distinctUntilChanged(),
      switchMap(active => active ? context.childScope$ : context.passiveChildScope$)
    );
    super(scope$, context.passiveChildScope$);
  }
}
