import {Directive, Input, TemplateRef} from "@angular/core";
import {AsyncOrSyncVal, UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective} from "./ngx-condition.directive";

@Directive({selector: '[ngxIfNot]', standalone: true})
export class NgxIfNotDirective<T extends AsyncOrSyncVal<unknown>> extends NgxConditionDirective<T, {}> {

  @Input({required: true, alias: 'ngxIfNot'}) value!: T;
  @Input({alias: 'ngxIfNotElse'}) elseTemplate?: TemplateRef<void>;
  @Input({alias: 'ngxIfNotWaiting'}) waitingTemplate?: TemplateRef<void>;

  buildContext(value: UnwrappedAsyncOrSyncVal<T>): {} | undefined {
    if (!value) return {};
    return undefined;
  }

}
