import {ChangeDetectorRef, Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import {switchMap} from "rxjs";
import {FutureLoading} from "@juulsgaard/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[whenLoading]'})
export class WhenLoadingDirective<T> extends BaseFutureRender<TemplateContext<T>> {

  state = input.required<FutureSwitch<T>>({alias: 'whenLoading'});

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    const state$ = toObservable(this.state).pipe(switchMap(x => x.loading$));
    const state = toSignal(state$);

    effect(() => {
      const x = state();
      if (!x) return this.updateView(undefined);

      this.updateView({
        data: x instanceof FutureLoading ? x.value : undefined,
        loading: x instanceof FutureLoading
      });
    });
  }

  static ngTemplateContextGuard<T>(
    directive: WhenLoadingDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }
}

interface TemplateContext<T> {
  data: T|undefined;
  loading: boolean;
}
