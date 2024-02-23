import {computed, Directive, effect, ElementRef, inject, NgZone, OnDestroy, Signal} from '@angular/core';
import {UIScopeContext} from "../models/ui-scope";
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";
import {elementClassManager, IScrollContext, ScrollContext} from "@juulsgaard/ngx-tools";

@Directive({
  selector: '[uiWrapper],ui-wrapper',
  standalone: true,
  providers: [
    UIScopeContext.ProvideChild(),
    ScrollContext.Provide(() => UiWrapperDirective)
  ],
  host: {'[class.ui-wrapper]': 'true'}
})
export class UiWrapperDirective implements OnDestroy, IScrollContext {

  readonly scrollable: Signal<boolean>;
  cdkScrollable: CdkScrollable;

  scrollDispatcher = inject(ScrollDispatcher);
  element = inject(ElementRef<HTMLElement>).nativeElement;

  constructor() {
    this.cdkScrollable = new CdkScrollable(
      inject(ElementRef<HTMLElement>),
      this.scrollDispatcher,
      inject(NgZone)
    );

    const context = inject(UIScopeContext, {skipSelf: true});

    const wrapper = context.registerWrapper();
    elementClassManager(computed(() => wrapper().classes));

    this.scrollable = computed(() => wrapper().scrollable);
    effect(() => {
      if (this.scrollable()) this.scrollDispatcher.register(this.cdkScrollable);
      else this.scrollDispatcher.deregister(this.cdkScrollable);
    });
  }

  ngOnDestroy() {
    this.scrollDispatcher.deregister(this.cdkScrollable);
  }
}
