import {ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";

@Directive({selector: '[whenErrorOverlay], [whenErrorOverlay][whenErrorOverlayFrom]'})
export class WhenErrorOverlayDirective<T> extends BaseFutureRender<TemplateContext<T>> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenErrorOverlay')
  set state(state: FutureSwitch<T>|string) {
    if (!(state instanceof FutureSwitch<T>)) return;
    this.states$.next(state);
  }

  @Input('whenErrorOverlayFrom')
  set fromState(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    templateRef: TemplateRef<TemplateContext<T>>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    this.sub = this.states$.pipe(
      switchMap(x => x.errorOverlay$),
      map(x => x ? {$implicit: x.error, data: x.value} as TemplateContext<T> : undefined)
    ).subscribe(c => this.updateView(c));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

interface TemplateContext<T> {
  $implicit: Error;
  data: T|undefined;
}
