import {Directive, Input, TemplateRef} from '@angular/core';
import {AsyncOrSyncVal, UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective} from "./ngx-condition.directive";
import {TruthyTypesOf} from "rxjs";

@Directive({selector: '[ngxIf]', standalone: true})
export class NgxIfDirective<T extends AsyncOrSyncVal<unknown>> extends NgxConditionDirective<T, NgxIfTemplateContext<T>> {

  @Input({required: true, alias: 'ngxIf'}) value!: T;
  @Input({alias: 'ngxIfElse'}) elseTemplate?: TemplateRef<void>;
  @Input({alias: 'ngxIfWaiting'}) waitingTemplate?: TemplateRef<void>;

  buildContext(value: UnwrappedAsyncOrSyncVal<T>): NgxIfTemplateContext<T> | undefined {
    if (!value) return undefined;
    return {ngxIf: value as TruthyTypesOf<typeof value>};
  }

  static ngTemplateContextGuard<T extends AsyncOrSyncVal<unknown>>(
    directive: NgxIfDirective<T>,
    context: unknown
  ): context is NgxIfTemplateContext<T> {
    return true;
  }
}

export interface NgxIfTemplateContext<T> {
  ngxIf: TruthyTypesOf<UnwrappedAsyncOrSyncVal<T>>;
}
