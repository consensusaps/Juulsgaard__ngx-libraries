import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {map, switchMap} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";
import {FutureError, FutureLoading} from "@juulsgaard/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";

@Directive({selector: '[whenEmpty]'})
export class WhenEmptyDirective<T> extends BaseFutureRender<TemplateContext> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenEmpty')
  set state(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    templateRef: TemplateRef<TemplateContext>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    this.sub = this.states$.pipe(
      switchMap(x => x.empty$),
      map(x => x ? {
        loading: x instanceof FutureLoading,
        error: x instanceof FutureError ? x.error : undefined
      } as TemplateContext : undefined)
    ).subscribe(c => this.updateView(c));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  static ngTemplateContextGuard<T>(
    directive: WhenEmptyDirective<T>,
    context: unknown
  ): context is TemplateContext {
    return true;
  }
}

interface TemplateContext {
  error: Error|undefined;
  loading: boolean;
}
