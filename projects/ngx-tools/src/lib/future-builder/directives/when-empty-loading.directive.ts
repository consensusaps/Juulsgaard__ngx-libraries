import {ChangeDetectorRef, Directive, effect, input, InputSignal, TemplateRef, ViewContainerRef} from '@angular/core';
import {switchMap} from "rxjs";
import {FutureLoading} from "@juulsgaard/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[whenEmptyLoading]'})
export class WhenEmptyLoadingDirective<T> extends BaseFutureRender<TemplateContext> {

  state: InputSignal<FutureSwitch<T>> = input.required<FutureSwitch<T>>({alias: 'whenEmptyLoading'});

  constructor(
    templateRef: TemplateRef<TemplateContext>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    const state$ = toObservable(this.state).pipe(switchMap(x => x.emptyLoading$));
    const state = toSignal(state$);

    effect(() => {
      const x = state();
      if (!x) return this.updateView(undefined);

      this.updateView({loading: x instanceof FutureLoading});
    });
  }

  static ngTemplateContextGuard<T>(
    directive: WhenEmptyLoadingDirective<T>,
    context: unknown
  ): context is TemplateContext {
    return true;
  }
}

interface TemplateContext {
  loading: boolean;
}
