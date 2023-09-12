import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {FutureLoading} from "@juulsgaard/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";

@Directive({selector: '[whenEmptyLoading]'})
export class WhenEmptyLoadingDirective<T> extends BaseFutureRender<TemplateContext> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenEmptyLoading') set state(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    templateRef: TemplateRef<TemplateContext>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    this.sub = this.states$.pipe(
      switchMap(x => x.emptyLoading$),
      map(x => x ? {loading: x instanceof FutureLoading} as TemplateContext : undefined)
    ).subscribe(c => this.updateView(c));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  static ngTemplateContextGuard<T>(
    directive: WhenEmptyLoadingDirective<T>,
    context: unknown
  ): context is TemplateContext {
    return true;
  }
}

interface TemplateContext {
  loading: boolean;
}
