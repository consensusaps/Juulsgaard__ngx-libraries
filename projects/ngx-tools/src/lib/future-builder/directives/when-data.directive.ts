import {Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {FutureSwitch} from "../models/future-switch.model";

@Directive({selector: '[whenData], [whenData][whenDataFrom]'})
export class WhenDataDirective<T> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenData')
  set state(state: FutureSwitch<T>|string) {
    if (!(state instanceof FutureSwitch<T>)) return;
    this.states$.next(state);
  }

  @Input('whenDataFrom')
  set fromState(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    this.sub = this.states$.pipe(
      switchMap(x => x.data$),
      map(x => x ? {$implicit: x.value} as TemplateContext<T> : undefined)
    ).subscribe(c => {
      if (c) this.viewContainer.createEmbeddedView(this.templateRef, c);
      else this.viewContainer.clear();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

interface TemplateContext<T> {
  $implicit: T;
}
