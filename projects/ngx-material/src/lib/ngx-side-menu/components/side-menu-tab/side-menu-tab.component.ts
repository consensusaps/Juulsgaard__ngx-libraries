import {
  booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, input, InputSignal, InputSignalWithTransform,
  viewChild
} from '@angular/core';
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

  readonly slug: InputSignal<string> = input.required<string>();
  readonly name: InputSignal<string | undefined> = input<string>();
  readonly icon: InputSignal<string | undefined> = input<string>();
  readonly badge: InputSignal<string | undefined> = input<string>();
  readonly badgeColor: InputSignal<ThemePalette | undefined> = input<ThemePalette>();

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly hide: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly source = viewChild.required('source', {read: RenderSourceDirective});
}
