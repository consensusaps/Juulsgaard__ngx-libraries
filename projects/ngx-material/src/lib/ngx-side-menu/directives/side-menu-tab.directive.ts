import {Directive, forwardRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {NgxSideMenuTabContext} from "../models/menu-tab-context";

@Directive({
  selector: '[ngxMenuTab]',
  providers: [{provide: NgxSideMenuTabContext, useExisting: forwardRef(() => SideMenuTabDirective)}]
})
export class SideMenuTabDirective extends NgxSideMenuTabContext {

  @Input('ngxMenuTab') id!: string;

  @Input() name?: string;
  @Input() icon?: string;
  @Input() badge?: string;


  constructor(
    readonly templateRef: TemplateRef<void>,
    readonly viewContainer: ViewContainerRef
  ) {
    super();
  }

}
