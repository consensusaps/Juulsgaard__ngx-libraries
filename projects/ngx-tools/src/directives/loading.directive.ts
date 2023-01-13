import {Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {Subscribable, Unsubscribable} from "rxjs";


@Directive({
  selector: '[isLoading]',
  host: {
    class: 'ngx-is-loading'
  },
  standalone: true
})
export class LoadingDirective implements OnDestroy {

  sub?: Unsubscribable;

  set loading(loading: boolean) {
    this.element.nativeElement.classList.toggle('loading', loading);
  }

  constructor(private element: ElementRef<HTMLElement>) {
  }

  @Input() set isLoading(state: boolean|Promise<any>|Subscribable<boolean>|undefined|null) {

    if (state == null || state === false) {
      this.loading = false;
      return;
    }

    if (state === true) {
      this.loading = true;
      return;
    }

    if (state instanceof Promise) {
      this.loading = true;
      state.finally(() => this.loading = false);
      return;
    }

    this.sub?.unsubscribe();
    this.sub = state.subscribe({next: x => this.loading = x});
    return;
  };

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
