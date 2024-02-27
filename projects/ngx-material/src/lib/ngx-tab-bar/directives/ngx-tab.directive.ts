import {
  booleanAttribute, computed, Directive, effect, ElementRef, forwardRef, inject, input, InputSignal,
  InputSignalWithTransform
} from '@angular/core';
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

  readonly slug: InputSignal<string> = input.required<string>({alias: 'ngxTab'});
  readonly tabName: InputSignal<string | undefined> = input<string>();
  readonly name = computed(() => this.tabName() ?? titleCase(this.slug()));

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly hide: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  constructor() {
    super();
    const element = inject(ElementRef<HTMLElement>).nativeElement;

    effect(() => {
      element.style.display = this.isOpen() ? '' : 'none'
    });
  }
}

