import {
  booleanAttribute, Directive, forwardRef, inject, input, signal, TemplateRef, ViewContainerRef
} from '@angular/core';
import {NgxSideMenuTabContext} from "../models/menu-tab-context";
import {ThemePalette} from "@angular/material/core";
import {RenderSource} from "@juulsgaard/ngx-tools";

@Directive({
  selector: '[ngxMenuTab]',
  providers: [{provide: NgxSideMenuTabContext, useExisting: forwardRef(() => SideMenuTabDirective)}]
})
export class SideMenuTabDirective extends NgxSideMenuTabContext implements RenderSource {

  id = input.required<string>({alias: 'ngxMenuTab'});
  name = input<string>();
  icon = input<string>();
  badge = input<string>();
  badgeColor = input<ThemePalette>();

  disabled = input(false, {transform: booleanAttribute});
  hidden = input(false, {transform: booleanAttribute});

  source = signal(this);

  readonly template = inject(TemplateRef<{}>);
  readonly viewContainer = inject(ViewContainerRef);
}
