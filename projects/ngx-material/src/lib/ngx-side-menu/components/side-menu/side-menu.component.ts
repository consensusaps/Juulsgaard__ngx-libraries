import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChildren, effect, forwardRef, inject, Injector,
  input, model, OnDestroy, Signal
} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {NgxSideMenuContext} from "../../models/menu-context";
import {SideMenuInstance} from "../../models/side-menu-instance";
import {SideMenuManagerService} from "../../services/side-menu-manager.service";

@Component({
  selector: 'ngx-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgxSideMenuContext, useExisting: forwardRef(() => SideMenuComponent)}]
})
export class SideMenuComponent extends NgxSideMenuContext implements OnDestroy {

  private menuManager = inject(SideMenuManagerService);
  private injector = inject(Injector);

  children = contentChildren(NgxSideMenuTabContext, {descendants: false});
  tabs = computed(() => {
    let tabs = this.children();
    return tabs.filter(t => !t.disabled());
  });

  show = model(false);
  active = model<string|undefined>(undefined);
  showButtons = input(false, {transform: booleanAttribute});
  tab: Signal<NgxSideMenuTabContext|undefined>;

  private instance?: SideMenuInstance;

  constructor() {
    super();

    this.tab = computed(() => {
      const tabs = this.tabs();
      if (tabs.length <= 0) return undefined;

      const active = this.active();

      if (active != null) {
        const tab = tabs.find(x => x.id() === active);
        if (tab) return tab;
      }

      if (this.show()) {
        return tabs.at(0);
      }

      return undefined;
    });

    const hasTabs = computed(() => this.tabs().length > 0);

    effect(() => {
      if (hasTabs()) {
        if (this.instance) return;
        this.instance = this.menuManager.createMenu(this, {}, this.injector);
        return;
      }

      if (!this.instance) return;
      this.menuManager.closeMenu(this.instance);
    });
  }

  ngOnDestroy() {
    if (!this.instance) return;
    this.menuManager.closeMenu(this.instance);
  }

  async toggleTab(tab: NgxSideMenuTabContext) {
    const id = tab.id();
    this.active.update(x => x === id ? undefined : id);
    this.show.set(false);
  }

  override openTab(slug: string) {
    this.active.set(slug);
    this.show.set(false);
  }

  override close() {
    this.active.set(undefined);
    this.show.set(false);
  }
}
