import {booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, input, viewChild} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {ThemePalette} from "@angular/material/core";
import {RenderSourceDirective} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'ngx-side-menu-tab',
  templateUrl: './side-menu-tab.component.html',
  styleUrls: ['./side-menu-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgxSideMenuTabContext, useExisting: forwardRef(() => SideMenuTabComponent)}]
})
export class SideMenuTabComponent extends NgxSideMenuTabContext {

  slug = input.required<string>();
  name = input<string>();
  icon = input<string>();
  badge = input<string>();
  badgeColor = input<ThemePalette>();

  disabled = input(false, {transform: booleanAttribute});
  hide = input(false, {transform: booleanAttribute});

  source = viewChild.required('source', {read: RenderSourceDirective});
}
