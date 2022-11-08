import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {FutureSwitch} from "../models/future-switch.model";

@Directive({selector: '[whenEmptyError], [whenEmptyError][whenEmptyErrorFrom]'})
export class WhenEmptyErrorDirective<T> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenEmptyError')
  set state(state: FutureSwitch<T>|string) {
    if (!(state instanceof FutureSwitch<T>)) return;
    this.states$.next(state);
  }

  @Input('whenEmptyErrorFrom')
  set fromState(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef,
    private changes: ChangeDetectorRef
  ) {
    this.sub = this.states$.pipe(
      switchMap(x => x.emptyError$),
      map(x => x ? {$implicit: x.error} as TemplateContext<T> : undefined)
    ).subscribe(c => {
      if (c) this.viewContainer.createEmbeddedView(this.templateRef, c);
      else this.viewContainer.clear();
      this.changes.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

interface TemplateContext<T> {
  $implicit: Error;
}
