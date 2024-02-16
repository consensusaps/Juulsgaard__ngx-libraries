import {ChangeDetectorRef, Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import {switchMap} from "rxjs";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[whenError]'})
export class WhenErrorDirective<T> extends BaseFutureRender<TemplateContext<T>> {

  state = input.required<FutureSwitch<T>>({alias: 'whenError'});

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    const state$ = toObservable(this.state).pipe(switchMap(x => x.error$));
    const state = toSignal(state$);

    effect(() => {
      const x = state();
      if (!x) return this.updateView(undefined);

      this.updateView({whenError: x.error, data: x.value});
    });
  }

  static ngTemplateContextGuard<T>(
    directive: WhenErrorDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }
}

interface TemplateContext<T> {
  whenError: Error;
  data: T|undefined;
}
