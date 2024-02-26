import {Directive, input, InputSignal, TemplateRef} from "@angular/core";
import {UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective} from "./ngx-condition.directive";

@Directive({selector: '[ngxIfNot]', standalone: true})
export class NgxIfNotDirective<T> extends NgxConditionDirective<T, {}> {

  value: InputSignal<T> = input.required<T>({alias: 'ngxIfNot'});
  elseTemplate: InputSignal<TemplateRef<void> | undefined> = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfNotElse'});
  waitingTemplate: InputSignal<TemplateRef<void> | undefined> = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfNotWaiting'});

  buildContext(value: UnwrappedAsyncOrSyncVal<T>): {} | undefined {
    if (!value) return {};
    return undefined;
  }

}
