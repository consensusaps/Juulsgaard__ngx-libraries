import {ChangeDetectorRef, Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import {switchMap} from "rxjs/operators";
import {FutureError, FutureLoading} from "@juulsgaard/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[whenEmpty]'})
export class WhenEmptyDirective<T> extends BaseFutureRender<TemplateContext> {

  state = input.required<FutureSwitch<T>>({alias: 'whenEmpty'})

  constructor(
    templateRef: TemplateRef<TemplateContext>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    const state$ = toObservable(this.state).pipe(switchMap(x => x.empty$));
    const state = toSignal(state$);

    effect(() => {
      const empty = state();
      if (!empty) return this.updateView(undefined);

      this.updateView({
        loading: empty instanceof FutureLoading,
        error: empty instanceof FutureError ? empty.error : undefined
      });
    });
  }

  static ngTemplateContextGuard<T>(
    directive: WhenEmptyDirective<T>,
    context: unknown
  ): context is TemplateContext {
    return true;
  }
}

interface TemplateContext {
  error: Error|undefined;
  loading: boolean;
}
