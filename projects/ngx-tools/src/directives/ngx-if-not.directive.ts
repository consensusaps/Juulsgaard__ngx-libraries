import {Directive, input, TemplateRef} from "@angular/core";
import {AsyncOrSyncVal, UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective} from "./ngx-condition.directive";

@Directive({selector: '[ngxIfNot]', standalone: true})
export class NgxIfNotDirective<T extends AsyncOrSyncVal<unknown>> extends NgxConditionDirective<T, {}> {

  value = input.required<T>({alias: 'ngxIfNot'});
  elseTemplate = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfNotElse'});
  waitingTemplate = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfNotWaiting'});

  buildContext(value: UnwrappedAsyncOrSyncVal<T>): {} | undefined {
    if (!value) return {};
    return undefined;
  }

}
