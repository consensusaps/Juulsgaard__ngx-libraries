import {Directive, effect, ElementRef, input, InputSignalWithTransform, NgZone, OnDestroy, Signal} from '@angular/core';
import {secondsToTimeAgo} from "../helpers/time-ago";
import {fromEvent} from "rxjs";
import {map} from "rxjs/operators";
import {toSignal} from "@angular/core/rxjs-interop";

@Directive({selector: '[timeAgo]', standalone: true})
export class TimeAgoDirective implements OnDestroy {

  private static readonly minute = 60;
  private static readonly hour = 60 * 60;
  private static readonly day = 60 * 60 * 24;

  timer?: number;

  readonly hidden: Signal<boolean>;
  readonly date: InputSignalWithTransform<undefined | Date, Date | string | undefined> = input.required({
    alias: 'timeAgo',
    transform: (value: Date | string | undefined) => {
      if (!value) return undefined;
      return value instanceof Date ? value : new Date(value);
    }
  })

  constructor(private element: ElementRef<HTMLElement>, private zone: NgZone) {

    this.hidden = toSignal(
      fromEvent(document, 'visibilitychange').pipe(map(() => document.hidden)),
      {initialValue: document.hidden}
    );

    effect(() => {
      if (this.hidden()) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    });
  }

  private startTimer() {
    clearTimeout(this.timer);
    if (!this.date()) return;
    this.zone.runOutsideAngular(() => this.applyValue());
  }

  private stopTimer() {
    clearTimeout(this.timer);
  }

  applyValue() {
    const date = this.date();
    if (!date) return;

    const now = Date.now();

    const secondsElapsed = (
      now - date.getTime()
    ) / 1000;
    const inFuture = secondsElapsed < 0;
    const seconds = Math.round(Math.abs(secondsElapsed));

    const delay = TimeAgoDirective.getSecondsUntilUpdate(seconds) * 1000;

    // @ts-ignore
    this.timer = setTimeout(() => this.applyValue(), delay);

    this.element.nativeElement.innerText = secondsToTimeAgo(seconds, inFuture);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private static getSecondsUntilUpdate(seconds: number) {

    // less than 1 min, update every 2 secs
    if (seconds < this.minute) return 2;

    // less than an hour, update every 30 secs
    if (seconds < this.hour) return 30;

    // less than a day, update every 5 mins
    if (seconds < this.day) return 300;

    // update every hour
    return 3600;
  }
}
