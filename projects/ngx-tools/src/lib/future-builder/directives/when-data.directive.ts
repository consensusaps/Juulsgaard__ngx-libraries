import {ChangeDetectorRef, Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import {switchMap} from "rxjs";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[whenData]'})
export class WhenDataDirective<T> extends BaseFutureRender<TemplateContext<T>> {

  state = input.required<FutureSwitch<T>>({alias: 'whenData'})

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    const state$ = toObservable(this.state).pipe(switchMap(x => x.data$));
    const state = toSignal(state$);

    effect(() => {
      const val = state();
      if (!val) this.updateView(undefined);
      else this.updateView({whenData: val.value});
    });
  }

  static ngTemplateContextGuard<T>(
    directive: WhenDataDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  whenData: T;
}
