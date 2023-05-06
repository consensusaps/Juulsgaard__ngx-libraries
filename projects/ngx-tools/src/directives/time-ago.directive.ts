import {Directive, ElementRef, Input, NgZone, OnDestroy} from '@angular/core';
import {secondsToTimeAgo} from "../helpers/time-ago";

@Directive({selector: '[timeAgo]', standalone: true})
export class TimeAgoDirective implements OnDestroy {

  private static readonly minute = 60;
  private static readonly hour = 60 * 60;
  private static readonly day = 60 * 60 * 24;

  timer?: number;
  date?: Date;

  constructor(private element: ElementRef<HTMLElement>, private zone: NgZone) {
  }

  @Input() set timeAgo(value: Date | string | undefined) {

    clearTimeout(this.timer);

    if (!value) {
      this.date = undefined;
      return;
    }

    this.date = value instanceof Date ? value : new Date(value);
    this.zone.runOutsideAngular(() => this.applyValue());
  }

  applyValue() {
    if (!this.date) return;

    const now = Date.now();

    const secondsElapsed = (now - this.date.getTime()) / 1000;
    const inFuture = secondsElapsed < 0;
    const seconds = Math.round(Math.abs(secondsElapsed));

    const delay = TimeAgoDirective.getSecondsUntilUpdate(seconds) * 1000;

    // @ts-ignore
    this.timer = setTimeout(() => this.applyValue(), delay);

    this.element.nativeElement.innerText = secondsToTimeAgo(seconds, inFuture);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
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
