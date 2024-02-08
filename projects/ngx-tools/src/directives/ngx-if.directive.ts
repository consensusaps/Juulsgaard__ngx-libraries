import {Directive, Input, TemplateRef} from '@angular/core';
import {AsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective, NgxConditionTemplateContext} from "./ngx-condition.directive";

@Directive({selector: '[ngxIf]', standalone: true})
export class NgxIfDirective<T extends AsyncOrSyncVal<unknown>> extends NgxConditionDirective<T> {

  @Input({required: true, alias: 'ngxIf'}) value!: T;
  @Input({alias: 'ngxIfElse'}) elseTemplate?: TemplateRef<void>;
  @Input({alias: 'ngxIfWaiting'}) waitingTemplate?: TemplateRef<void>;

  override shouldRender(value: T): boolean {
    return !!value;
  }

  static ngTemplateContextGuard<T extends AsyncOrSyncVal<unknown>>(
    directive: NgxIfDirective<T>,
    context: unknown
  ): context is NgxConditionTemplateContext<T> {
    return true;
  }
}

