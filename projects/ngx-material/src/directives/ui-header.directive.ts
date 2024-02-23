import {computed, Directive, inject} from '@angular/core';
import {UIScopeContext} from "../models";
import {elementClassManager} from "@juulsgaard/ngx-tools";

@Directive({selector: '[uiHeader]', standalone: true})
export class UiHeaderDirective {

  private uiContext = inject(UIScopeContext);

  constructor() {
    const header = this.uiContext.registerHeader();
    elementClassManager(computed(() => header().classes));
  }
}
