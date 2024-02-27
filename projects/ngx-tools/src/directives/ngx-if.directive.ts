import {Directive, input, InputSignal, TemplateRef} from '@angular/core';
import {UnwrappedAsyncOrSyncVal} from "@juulsgaard/rxjs-tools";
import {NgxConditionDirective} from "./ngx-condition.directive";
import {TruthyTypesOf} from "rxjs";

@Directive({selector: '[ngxIf]', standalone: true})
export class NgxIfDirective<T> extends NgxConditionDirective<T, NgxIfTemplateContext<T>> {

  value: InputSignal<T> = input.required<T>({alias: 'ngxIf'});
  elseTemplate: InputSignal<TemplateRef<void> | undefined> = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfElse'});
  waitingTemplate: InputSignal<TemplateRef<void> | undefined> = input<TemplateRef<void>|undefined>(undefined, {alias: 'ngxIfWaiting'});

  buildContext(value: UnwrappedAsyncOrSyncVal<T>): NgxIfTemplateContext<T> | undefined {
    if (!value) return undefined;
    return {ngxIf: value as TruthyTypesOf<typeof value>};
  }

  static ngTemplateContextGuard<T>(
    directive: NgxIfDirective<T>,
    context: unknown
  ): context is NgxIfTemplateContext<T> {
    return true;
  }
}

export interface NgxIfTemplateContext<T> {
  ngxIf: TruthyTypesOf<UnwrappedAsyncOrSyncVal<T>>;
}
