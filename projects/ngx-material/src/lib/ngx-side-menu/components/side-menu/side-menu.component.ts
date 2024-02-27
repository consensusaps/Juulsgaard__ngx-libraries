import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChildren, forwardRef, input,
  InputSignalWithTransform, model, ModelSignal, Signal
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

  readonly children = contentChildren(NgxSideMenuTabContext, {descendants: false});
  readonly tabs = computed(() => {
    let tabs = this.children();
    return tabs.filter(t => !t.disabled());
  });

  readonly active: ModelSignal<string | undefined> = model<string|undefined>(undefined);
  readonly showButtons: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly tab: Signal<NgxSideMenuTabContext|undefined>;

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
