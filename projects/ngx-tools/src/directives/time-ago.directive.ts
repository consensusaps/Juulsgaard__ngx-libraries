import {Directive, ElementRef, Input, NgZone, OnDestroy} from '@angular/core';
import {secondsToTimeAgo} from "../helpers/time-ago";
import {fromEvent} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({selector: '[timeAgo]', standalone: true})
export class TimeAgoDirective implements OnDestroy {

  private static readonly minute = 60;
  private static readonly hour = 60 * 60;
  private static readonly day = 60 * 60 * 24;

  timer?: number;
  date?: Date;
  @Input() set timeAgo(value: Date | string | undefined) {
    if (!value) {
      this.date = undefined;
      return;
    }

    this.date = value instanceof Date ? value : new Date(value);
    if (document.hidden) return;
    this.startTimer();
  }

  constructor(private element: ElementRef<HTMLElement>, private zone: NgZone) {
    zone.runOutsideAngular(
      () => fromEvent(document, 'visibilitychange').pipe(
        map(() => !document.hidden),
        distinctUntilChanged(),
        takeUntilDestroyed()
      ).subscribe(x => this.visibilityChanged(x))
    );
  }

  private startTimer() {
    clearTimeout(this.timer);
    if (!this.date) return;
    this.zone.runOutsideAngular(() => this.applyValue());
  }

  private stopTimer() {
    clearTimeout(this.timer);
  }

  private visibilityChanged(visible: boolean) {
    if (visible) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
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
