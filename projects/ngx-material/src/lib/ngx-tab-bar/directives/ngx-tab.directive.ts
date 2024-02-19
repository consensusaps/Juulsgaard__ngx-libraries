import {booleanAttribute, computed, Directive, effect, ElementRef, forwardRef, inject, input} from '@angular/core';
import {NgxTabContext} from "../services";
import {UIScopeContext} from "../../../models";
import {titleCase} from "@juulsgaard/ts-tools";

@Directive({
  selector: '[ngxTab]',
  providers: [
    {provide: NgxTabContext, useExisting: forwardRef(() => NgxTabDirective)},
    UIScopeContext.ProvideChild()
  ],
  host: {'[class.ngx-tab]': 'true'}
})
export class NgxTabDirective extends NgxTabContext {

  slug = input.required<string>({alias: 'ngxTab'});
  tabName = input<string>();
  name = computed(() => this.tabName() ?? titleCase(this.slug()));

  disabled = input(false, {transform: booleanAttribute});
  hide = input(false, {transform: booleanAttribute});

  constructor() {
    super();
    const element = inject(ElementRef<HTMLElement>).nativeElement;

    effect(() => {
      element.style.display = this.isOpen() ? '' : 'none'
    });
  }
}

