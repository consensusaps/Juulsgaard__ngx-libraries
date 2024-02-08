import {Directive, Input, TemplateRef} from "@angular/core";
import {AsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective, NgxConditionTemplateContext} from "./ngx-condition.directive";

@Directive({selector: '[ngxIfNot]', standalone: true})
export class NgxIfNotDirective<T extends AsyncOrSyncVal<unknown>> extends NgxConditionDirective<T> {

  @Input({required: true, alias: 'ngxIfNot'}) value!: T;
  @Input({alias: 'ngxIfNotElse'}) elseTemplate?: TemplateRef<void>;
  @Input({alias: 'ngxIfNotWaiting'}) waitingTemplate?: TemplateRef<void>;

  override shouldRender(value: T): boolean {
    return !value;
  }

  static ngTemplateContextGuard<T extends AsyncOrSyncVal<unknown>>(
    directive: NgxIfNotDirective<T>,
    context: unknown
  ): context is NgxConditionTemplateContext<T> {
    return true;
  }
}
