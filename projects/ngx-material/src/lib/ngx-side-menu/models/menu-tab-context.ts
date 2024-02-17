import {computed, inject, Signal} from "@angular/core";
import {NgxSideMenuContext} from "./menu-context";
import {ThemePalette} from "@angular/material/core";
import {RenderSource} from "@juulsgaard/ngx-tools";

export abstract class NgxSideMenuTabContext {

  private context = inject(NgxSideMenuContext);

  abstract slug: Signal<string>;
  abstract name: Signal<string|undefined>;
  abstract icon: Signal<string|undefined>;
  abstract badge: Signal<string|undefined>;
  abstract badgeColor: Signal<ThemePalette|undefined>;

  abstract disabled: Signal<boolean>;
  abstract hide: Signal<boolean>;

  abstract source: Signal<RenderSource>;

  isOpen = computed(() => this.context.tab() === this);

  open() {
    this.context.openTab(this.slug());
  }

  openTab(tab: string) {
    this.context.openTab(tab);
  }
}
