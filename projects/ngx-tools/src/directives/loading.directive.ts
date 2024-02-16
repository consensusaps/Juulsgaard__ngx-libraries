import {Directive, ElementRef, input} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscribable, switchMap} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";
import {toObservable} from "@angular/core/rxjs-interop";


@Directive({
  selector: '[isLoading]',
  host: {
    class: 'ngx-is-loading'
  },
  standalone: true
})
export class LoadingDirective {

  private readonly spinner: HTMLDivElement;

  isLoading = input.required({
    transform: (state: boolean|''|Promise<unknown>|Subscribable<boolean>|undefined|null): Observable<boolean> => {
      if (state === '' || state === true) return of(true);
      if (state == null || state === false) return of(false);

      if (state instanceof Promise) {
        const subject = new BehaviorSubject(true);
        state.finally(() => {
          subject.next(false);
          subject.complete();
        });
        return subject;
      }

      return new Observable<boolean>(subscriber => state.subscribe(subscriber));
    }
  });

  constructor(private element: ElementRef<HTMLElement>) {
    this.spinner = document.createElement('div');
    this.spinner.classList.add('ngx-is-loading-spinner');
    this.element.nativeElement.appendChild(this.spinner);
    this.setLoading(false);

    toObservable(this.isLoading).pipe(
      switchMap(x => x),
      distinctUntilChanged()
    ).subscribe(loading => this.setLoading(loading));
  }

  private setLoading(loading: boolean) {
    this.element.nativeElement.classList.toggle('loading', loading);
    this.spinner.style.display = loading ? '' : 'none';
  }
}
