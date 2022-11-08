import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {map, switchMap} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";
import {FutureError, FutureLoading} from "@consensus-labs/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";

@Directive({selector: '[whenEmpty]'})
export class WhenEmptyDirective<T> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenEmpty')
  set state(state: FutureSwitch<T>|string) {
    if (!(state instanceof FutureSwitch<T>)) return;
    this.states$.next(state);
  }

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef,
    private changes: ChangeDetectorRef
  ) {
    this.sub = this.states$.pipe(
      switchMap(x => x.empty$),
      map(x => x ? {
        loading: x instanceof FutureLoading,
        error: x instanceof FutureError ? x.error : undefined
      } as TemplateContext<T> : undefined)
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
  error: Error|undefined;
  loading: boolean;
}
