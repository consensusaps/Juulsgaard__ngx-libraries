import {
  booleanAttribute, Directive, forwardRef, inject, input, InputSignal, InputSignalWithTransform, signal, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {NgxSideMenuTabContext} from "../models/menu-tab-context";
import {ThemePalette} from "@angular/material/core";
import {RenderSource} from "@juulsgaard/ngx-tools";

@Directive({
  selector: '[ngxMenuTab]',
  providers: [{provide: NgxSideMenuTabContext, useExisting: forwardRef(() => SideMenuTabDirective)}]
})
export class SideMenuTabDirective extends NgxSideMenuTabContext implements RenderSource {

  readonly slug: InputSignal<string> = input.required<string>({alias: 'ngxMenuTab'});
  readonly name: InputSignal<string | undefined> = input<string>();
  readonly icon: InputSignal<string | undefined> = input<string>();
  readonly badge: InputSignal<string | undefined> = input<string>();
  readonly badgeColor: InputSignal<ThemePalette | undefined> = input<ThemePalette>();

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly hide: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly source = signal(this);

  readonly template = inject(TemplateRef<{}>);
  readonly viewContainer = inject(ViewContainerRef);
}
