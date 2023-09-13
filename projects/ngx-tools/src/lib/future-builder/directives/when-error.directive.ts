import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";

@Directive({selector: '[whenError]'})
export class WhenErrorDirective<T> extends BaseFutureRender<TemplateContext<T>> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenError')
  set state(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    this.sub = this.states$.pipe(
      switchMap(x => x.error$),
      map(x => x ? {whenError: x.error, data: x.value} as TemplateContext<T> : undefined)
    ).subscribe(c => this.updateView(c));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  static ngTemplateContextGuard<T>(
    directive: WhenErrorDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }
}

interface TemplateContext<T> {
  whenError: Error;
  data: T|undefined;
}
