import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, Subscribable, Unsubscribable} from "rxjs";
import {Future} from "@consensus-labs/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";

@Directive({
  selector: '[future][futureFrom]'
})
export class FutureDirective<T> implements OnDestroy {

  private futureSub?: Unsubscribable;
  private _future$ = new BehaviorSubject<Future<T>|undefined>(undefined);

  @Input() set futureFrom(future: Subscribable<Future<T>|undefined>|Future<T>|undefined) {

    this.futureSub?.unsubscribe();

    if (future === undefined) {
      this.emitFuture(undefined);
      return;
    }

    if (future instanceof Future) {
      this.emitFuture(future);
      return;
    }

    this.futureSub = future.subscribe({next: f => this.emitFuture(f)});
  };

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef,
    private changes: ChangeDetectorRef
  ) {
    this.viewContainer.createEmbeddedView(
      this.templateRef,
      {$implicit: new FutureSwitch<T>(this._future$)}
    );
  }

  ngOnDestroy() {
    this.futureSub?.unsubscribe();
    this._future$.complete();
  }

  emitFuture(future: Future<T>|undefined) {
    if (this._future$.value === future) return;
    this._future$.next(future);
    this.changes.detectChanges();
  }

}

interface TemplateContext<T> {
  $implicit: FutureSwitch<T>
}
