import {ChangeDetectorRef, Directive, effect, input, InputSignal, TemplateRef, ViewContainerRef} from '@angular/core';
import {switchMap} from "rxjs";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[whenErrorOverlay]'})
export class WhenErrorOverlayDirective<T> extends BaseFutureRender<TemplateContext<T>> {

  state: InputSignal<FutureSwitch<T>> = input.required<FutureSwitch<T>>({alias: 'whenErrorOverlay'});

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    const state$ = toObservable(this.state).pipe(switchMap(x => x.errorOverlay$));
    const state = toSignal(state$);

    effect(() => {
      const x = state();
      if (!x) return this.updateView(undefined);

      this.updateView({whenErrorOverlay: x.error, data: x.value});
    });
  }

  static ngTemplateContextGuard<T>(
    directive: WhenErrorOverlayDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }
}

interface TemplateContext<T> {
  whenErrorOverlay: Error;
  data: T|undefined;
}
