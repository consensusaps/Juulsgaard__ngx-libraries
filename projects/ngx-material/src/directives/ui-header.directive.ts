import {computed, Directive, inject, Signal} from '@angular/core';
import {UIScopeContext} from "../models";

@Directive({selector: '[uiHeader]', standalone: true, host: {'[class]': 'headerClass()'}})
export class UiHeaderDirective {

  readonly headerClass: Signal<string[]>;

  private uiContext = inject(UIScopeContext, {optional: true});

  constructor() {
    const header = this.uiContext?.registerHeader();

    this.headerClass = computed(() => {
      if (!header) return [];
      return header().classes;
    });
  }
}
