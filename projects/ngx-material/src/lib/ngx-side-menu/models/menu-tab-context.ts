import {computed, inject, Signal} from "@angular/core";
import {NgxSideMenuContext} from "./menu-context";
import {ThemePalette} from "@angular/material/core";
import {RenderSource} from "@juulsgaard/ngx-tools";

export abstract class NgxSideMenuTabContext {

  private context = inject(NgxSideMenuContext);

  abstract id: Signal<string>;
  abstract name: Signal<string|undefined>;
  abstract icon: Signal<string|undefined>;
  abstract badge: Signal<string|undefined>;
  abstract badgeColor: Signal<ThemePalette|undefined>;

  abstract disabled: Signal<boolean>;
  abstract hidden: Signal<boolean>;

  abstract source: Signal<RenderSource>;

  isOpen = computed(() => this.context.tab() === this);

  open() {
    this.context.openTab(this.id());
  }

  openTab(tab: string) {
    this.context.openTab(tab);
  }
}
