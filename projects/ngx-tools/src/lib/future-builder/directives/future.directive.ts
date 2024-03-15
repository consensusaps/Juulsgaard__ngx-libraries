import {Directive, input, InputSignalWithTransform, TemplateRef, ViewContainerRef} from '@angular/core';
import {asapScheduler, auditTime, EMPTY, Observable, of, Subscribable, switchMap} from "rxjs";
import {cache, Future} from "@juulsgaard/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {toObservable} from "@angular/core/rxjs-interop";
import {distinctUntilChanged} from "rxjs/operators";

@Directive({
  selector: '[future]'
})
export class FutureDirective<T> {

  future: InputSignalWithTransform<
    Observable<Future<T> | undefined>,
    Subscribable<Future<T> | undefined> | Future<T> | undefined | null
  > = input.required({
    transform: (future: Subscribable<Future<T> | undefined> | Future<T> | undefined | null): Observable<Future<T> | undefined> => {
      if (future == null) return EMPTY;
      if (future instanceof Future) return of(future);
      return new Observable(subscriber => future.subscribe(subscriber));
    }
  });

  constructor(
    public readonly viewContainer: ViewContainerRef,
    public readonly template: TemplateRef<TemplateContext<T>>,
  ) {
    const futures$ = toObservable(this.future).pipe(
      switchMap(x => x),
      distinctUntilChanged(),
      auditTime(0, asapScheduler),
      cache()
    );

    const view = this.viewContainer.createEmbeddedView(this.template, {future: new FutureSwitch<T>(futures$)});
    view.detectChanges();
    view.markForCheck();
  }

  static ngTemplateContextGuard<T>(
    directive: FutureDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  future: FutureSwitch<T>
}
