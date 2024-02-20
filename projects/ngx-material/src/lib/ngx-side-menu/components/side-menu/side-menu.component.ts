import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChildren, forwardRef, input, model, Signal
} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {NgxSideMenuContext} from "../../models/menu-context";

@Component({
  selector: 'ngx-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgxSideMenuContext, useExisting: forwardRef(() => SideMenuComponent)}]
})
export class SideMenuComponent extends NgxSideMenuContext {

  children = contentChildren(NgxSideMenuTabContext, {descendants: false});
  tabs = computed(() => {
    let tabs = this.children();
    return tabs.filter(t => !t.disabled());
  });

  active = model<string|undefined>(undefined);
  showButtons = input(false, {transform: booleanAttribute});
  tab: Signal<NgxSideMenuTabContext|undefined>;

  constructor() {
    super();

    this.tab = computed(() => {
      const tabs = this.tabs();
      if (tabs.length <= 0) return undefined;

      const active = this.active();
      if (active == null) return undefined;
      return tabs.find(x => x.slug() === active);
    });
  }

  async toggleTab(tab: NgxSideMenuTabContext) {
    const slug = tab.slug();
    const activeTab = this.tab();

    if (activeTab && activeTab.slug() == slug) {
      this.active.set(undefined);
      return;
    }

    this.active.set(slug);
  }

  override openTab(slug: string) {
    this.active.set(slug);
  }

  override close() {
    this.active.set(undefined);
  }
}
