import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChildren, forwardRef, input,
  InputSignalWithTransform, model, ModelSignal, signal, Signal
} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {NgxSideMenuContext} from "../../models/menu-context";

@Component({
  selector: 'ngx-mono-side-menu',
  templateUrl: './mono-side-menu.component.html',
  styleUrl: './mono-side-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgxSideMenuContext, useExisting: forwardRef(() => MonoSideMenuComponent)}]
})
export class MonoSideMenuComponent extends NgxSideMenuContext {
  readonly children = contentChildren(NgxSideMenuTabContext, {descendants: false});
  readonly tabs = computed(() => {
    let tabs = this.children();
    return tabs.filter(t => !t.disabled()).slice(0, 1);
  });

  readonly show: ModelSignal<boolean> = model(false);
  readonly showInlineButtons: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute, alias: 'showButtons'
  });
  readonly showButtons = signal(false);
  readonly tab: Signal<NgxSideMenuTabContext | undefined>;

  constructor() {
    super();

    this.tab = computed(() => {
      const tabs = this.tabs();
      if (tabs.length <= 0) return undefined;
      if (this.show()) return tabs.at(0);
      return undefined;
    });
  }

  async toggleTab(_tab: NgxSideMenuTabContext) {
    this.show.update(x => !x);
  }

  override openTab(_slug: string) {
    this.show.set(true);
  }

  override close() {
    this.show.set(false);
  }
}
