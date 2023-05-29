import {Directive, forwardRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {NgxSideMenuTabContext} from "../models/menu-tab-context";

@Directive({
  selector: '[ngxMenuTab]',
  providers: [{provide: NgxSideMenuTabContext, useExisting: forwardRef(() => SideMenuTabDirective)}]
})
export class SideMenuTabDirective extends NgxSideMenuTabContext {

  @Input('ngxMenuTab') id!: string;

  @Input('name') set nameData(name: string|undefined|null) {
    this._name$.next(name ?? undefined);
  };

  @Input('icon') set iconData(icon: string|undefined|null) {
    this._icon$.next(icon ?? undefined);
  };

  @Input('badge') set badgeData(badge: string|number|undefined|null) {
    if (typeof badge === 'number') {
      this._badge$.next(badge === 0 ? undefined : badge.toFixed(0));
      return;
    }

    this._badge$.next(badge ?? undefined);
  };

  constructor(
    readonly templateRef: TemplateRef<void>,
    readonly viewContainer: ViewContainerRef
  ) {
    super();
  }

}
