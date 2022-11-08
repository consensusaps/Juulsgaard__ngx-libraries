import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {FutureLoading} from "@consensus-labs/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";

@Directive({selector: '[whenEmptyLoading]'})
export class WhenEmptyLoadingDirective<T> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenEmptyLoading') set state(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef,
    private changes: ChangeDetectorRef
  ) {
    this.sub = this.states$.pipe(
      switchMap(x => x.emptyLoading$),
      map(x => x ? {loading: x instanceof FutureLoading} as TemplateContext<T> : undefined)
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
  loading: boolean;
}
