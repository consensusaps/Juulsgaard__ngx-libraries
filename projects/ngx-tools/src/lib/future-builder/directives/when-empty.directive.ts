import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {map, switchMap} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";
import {FutureError, FutureLoading} from "@consensus-labs/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";

@Directive({selector: '[whenEmpty]'})
export class WhenEmptyDirective<T> extends BaseFutureRender<TemplateContext<T>> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenEmpty')
  set state(state: FutureSwitch<T>|string) {
    if (!(state instanceof FutureSwitch<T>)) return;
    this.states$.next(state);
  }

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    this.sub = this.states$.pipe(
      switchMap(x => x.empty$),
      map(x => x ? {
        loading: x instanceof FutureLoading,
        error: x instanceof FutureError ? x.error : undefined
      } as TemplateContext<T> : undefined)
    ).subscribe(c => this.updateView(c));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

interface TemplateContext<T> {
  error: Error|undefined;
  loading: boolean;
}
