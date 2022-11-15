import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {FutureLoading} from "@consensus-labs/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";

@Directive({selector: '[whenEmptyLoading]'})
export class WhenEmptyLoadingDirective<T> extends BaseFutureRender<TemplateContext<T>> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenEmptyLoading') set state(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    this.sub = this.states$.pipe(
      switchMap(x => x.emptyLoading$),
      map(x => x ? {loading: x instanceof FutureLoading} as TemplateContext<T> : undefined)
    ).subscribe(c => this.updateView(c));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

interface TemplateContext<T> {
  loading: boolean;
}
