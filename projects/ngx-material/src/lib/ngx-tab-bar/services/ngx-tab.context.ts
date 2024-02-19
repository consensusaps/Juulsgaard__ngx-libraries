import {computed, inject, Injectable, Signal} from '@angular/core';
import {INavTab} from "../models/nav-tab.interface";
import {NgxTabBarContext} from "./ngx-tab-bar.context";

@Injectable()
export abstract class NgxTabContext implements INavTab {

  private context = inject(NgxTabBarContext);

  abstract slug: Signal<string>;
  abstract name: Signal<string>;

  isOpen = computed(() => this.context.tab() === this);
  isActive = computed(() => this.context.active() && this.isOpen());

  abstract disabled: Signal<boolean>;
  abstract hide: Signal<boolean>;

  async open() {
    await this.context.openTab(this.slug());
  }

  async openTab(slug: string) {
    await this.context.openTab(slug);
  }
}
