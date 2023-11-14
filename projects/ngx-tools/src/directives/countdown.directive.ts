import {Directive, ElementRef, inject, Input, LOCALE_ID, OnChanges, SimpleChanges} from '@angular/core';
import {objToArr, sortNumDesc} from "@juulsgaard/ts-tools";
import {concat, EMPTY, interval, share, startWith, Subscription, takeWhile, timer} from "rxjs";
import {map} from "rxjs/operators";
import {Dispose} from "../decorators";
import {formatDate} from "@angular/common";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

@Directive({selector: '[countdown]', standalone: true, host: {'[class.ngx-countdown]': 'true'}})
export class CountdownDirective implements OnChanges {

  @Input() countdownConfig: CountdownConfig = defaultCountdownConfig ;
  @Input({required: true, transform: (val: string|Date) => new Date(val)}) countdown!: Date;

  @Dispose timeSub?: Subscription;

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private locale = inject(LOCALE_ID);

  styleIndex = 0;
  dateFormatThreshold = DAY;
  timeFormatThreshold = HOUR;
  styleThresholds: {threshold: number, classes: string[] }[] = [];

  constructor() {
    this.applyConfig();
  }

  ngOnChanges(changes: SimpleChanges) {

    if ('countdownConfig' in changes) {
      this.applyConfig();
    }

    this.timeSub?.unsubscribe();
    this.styleIndex = -1;

    const delta = Math.floor((this.countdown.getTime() - Date.now()) / 1000);

    const dateDelta = delta - this.dateFormatThreshold;
    const dateDelay = dateDelta > 0 ? timer(Math.max(0, dateDelta + 1)) : EMPTY;

    const maxTimeDelay = Math.max(0, this.dateFormatThreshold - this.timeFormatThreshold - 1);
    const timeDelta = Math.min(delta - this.timeFormatThreshold, maxTimeDelay);
    const timeDelay = timeDelta > 0 ? timer(timeDelta) : EMPTY;

    const time$ = concat(dateDelay, timeDelay, interval(500)).pipe(
      startWith(undefined),
      map(() => this.countdown.getTime() - Date.now()),
      takeWhile(x => x > 0),
      map(x => Math.floor(x / 1000)),
      share()
    );

    this.timeSub = time$.subscribe(time => this.render(time));
  }

  private applyConfig() {
    this.dateFormatThreshold = parseTime(this.countdownConfig.dateFormatThreshold);
    this.timeFormatThreshold = parseTime(this.countdownConfig.timeFormatThreshold);
    this.styleThresholds = objToArr(this.countdownConfig.styleThresholds, (val, key) => ({
      threshold: parseTime(key),
      classes: Array.isArray(val) ? val : [val]
    }));
    this.styleThresholds.sort(sortNumDesc(x => x.threshold));
  }

  private render(time: number) {
    if (time > this.dateFormatThreshold) {
      return this.renderDate();
    }

    if (time > this.timeFormatThreshold) {
      return this.renderTime();
    }

    this.renderCountdown(formatTime(time));
  }

  private renderDate() {
    this.element.innerText = formatDate(this.countdown, 'short', this.locale);
  }

  private renderTime() {
    this.element.innerText = formatDate(this.countdown, 'shortTime', this.locale);
  }

  private renderCountdown([hours, minutes, seconds]: [string|undefined, string, string]) {
    this.element.innerText = (hours ? `${hours}:` : '') + `${minutes}:` + seconds;
  }
}

function parseTime(input: string|number) {
  if (typeof input === 'number') return input;

  let segments = input.split(':');
  if (segments.length > 3) segments = segments.slice(-3);

  let time = 0;

  for (let i = 0; i < segments.length; i++) {
    let number = Number(segments[i]);
    if (Number.isNaN(number)) number = 0;
    const weight = Math.pow(MINUTE, length - i - 1);
    time += weight * number;
  }

  return time;
}

function formatTime(time: number): [string|undefined, string, string] {
  let output = new Array(3);

  if (time >= HOUR) {
    output[0] = Math.floor(time/HOUR).toString().padStart(2, '0');
    time = time % HOUR
  } else {
    output[0] = undefined;
  }

  output[1] =  Math.floor(time / MINUTE).toString().padStart(2, '0');
  time = time % MINUTE;

  output[2] =  Math.floor(time).toString().padStart(2, '0');

  return output as [string|undefined, string, string];
}

export interface CountdownConfig {
  dateFormatThreshold: string|number;
  timeFormatThreshold: string|number;
  styleThresholds: Record<string|number, string|string[]>
}

export const defaultCountdownConfig: CountdownConfig = {
  dateFormatThreshold: DAY,
  timeFormatThreshold: HOUR,
  styleThresholds: {
    '0:10': 'critical',
    '1:00': 'close',
    '2:00': 'low',
    '10:00': 'medium',
  }
}
