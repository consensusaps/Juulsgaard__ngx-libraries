import {Directive, input, TemplateRef} from '@angular/core';
import {AsyncOrSyncVal, UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective} from "./ngx-condition.directive";
import {TruthyTypesOf} from "rxjs";

@Directive({selector: '[ngxIf]', standalone: true})
export class NgxIfDirective<T extends AsyncOrSyncVal<unknown>> extends NgxConditionDirective<T, NgxIfTemplateContext<T>> {

  value = input.required<T>({alias: 'ngxIf'});
  elseTemplate = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfElse'});
  waitingTemplate = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfWaiting'});

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
