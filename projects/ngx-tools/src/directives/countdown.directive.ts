import {Directive, ElementRef, inject, Input, LOCALE_ID, NgZone, OnChanges, SimpleChanges} from '@angular/core';
import {objToArr, sortNumDesc} from "@juulsgaard/ts-tools";
import {concat, EMPTY, endWith, fromEvent, interval, share, Subscription, takeWhile, timer} from "rxjs";
import {distinctUntilChanged, filter, map, tap} from "rxjs/operators";
import {Dispose} from "../decorators";
import {formatDate} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

@Directive({selector: '[countdown]', standalone: true, host: {'[class.ngx-countdown]': 'true'}})
export class CountdownDirective implements OnChanges {

  private config: CountdownConfig = defaultCountdownConfig
  @Input({alias: 'countdownConfig'}) set options(options: CountdownOptions) {
    this.config = {...defaultCountdownConfig, ...options};
  };

  @Input({required: true}) set countdown(date: Date | string | number) {
    this.endTime = new Date(date);
  };

  endTime!: Date;

  @Dispose timeSub?: Subscription;

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private locale = inject(LOCALE_ID);

  private dateTimeNode = document.createElement('span');
  private negativeNode = document.createElement('span');
  private hourNode = document.createElement('span');
  private minuteNode = document.createElement('span');
  private secondNode = document.createElement('span');

  private styleIndex = -1;
  private dateFormatThreshold = DAY;
  private timeFormatThreshold = HOUR;
  private styleThresholds: { threshold: number, classes: string[] }[] = [];
  private padLength = 2;
  private fillerNum = '00';

  private forceHours = false;
  private showHours = false;
  private forceMinutes = false;
  private showMinutes = false;

  constructor(private zone: NgZone) {
    this.applyConfig();

    this.dateTimeNode.classList.add('ngx-date-time');
    this.negativeNode.classList.add('ngx-negative');
    this.negativeNode.innerText = '-';
    this.hourNode.classList.add('ngx-hours');
    this.minuteNode.classList.add('ngx-minutes');
    this.secondNode.classList.add('ngx-seconds');
    this.element.append(this.dateTimeNode, this.negativeNode, this.hourNode, this.minuteNode, this.secondNode);

    zone.runOutsideAngular(
      () => fromEvent(document, 'visibilitychange').pipe(
        map(() => !document.hidden),
        distinctUntilChanged(),
        takeUntilDestroyed()
      ).subscribe(x => this.visibilityChanged(x))
    );
  }

  private visibilityChanged(visible: boolean) {
    if (visible) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  //<editor-fold desc="Updates">
  ngOnChanges(changes: SimpleChanges) {

    if ('countdownConfig' in changes) {
      this.applyConfig();
    }

    if (document.hidden) return;
    this.zone.runOutsideAngular(() => this.startTimer());
  }

  private startTimer() {
    this.timeSub?.unsubscribe();
    this.styleIndex = -1;
    this.resetClasses();

    const delta = Math.floor((
      this.endTime.getTime() - Date.now()
    ) / 1000);

    if (delta <= 0 && !this.config.countNegative) {
      this.render(0);
      return;
    }

    const dateDelta = delta - this.dateFormatThreshold;
    const dateDelay$ = dateDelta <= 0 ? EMPTY : timer(Math.max(0, dateDelta + 1)).pipe(
      tap({subscribe: () => this.renderDate()}),
      filter(() => false)
    );

    const maxTimeDelay = Math.max(0, this.dateFormatThreshold - this.timeFormatThreshold - 1);
    const timeDelta = Math.min(delta - this.timeFormatThreshold, maxTimeDelay);
    const timeDelay$ = timeDelta <= 0 ? EMPTY : timer(timeDelta).pipe(
      tap({subscribe: () => this.renderTime()}),
      filter(() => false)
    );

    const interval$ = interval(500).pipe(
      tap({subscribe: () => this.countdownStarted()})
    );

    let delta$ = concat(dateDelay$, timeDelay$, interval$).pipe(
      map(() => this.endTime.getTime() - Date.now())
    );

    if (!this.config.countNegative) {
      delta$ = delta$.pipe(
        takeWhile(x => x > 0),
        endWith(0)
      );
    }

    const time$ = delta$.pipe(
      map(x => Math.floor(x / 1000)),
      distinctUntilChanged(),
      share()
    );

    this.timeSub = time$.subscribe(time => this.render(time));
  }

  private stopTimer() {
    this.timeSub?.unsubscribe();
  }

  private applyConfig() {
    this.dateFormatThreshold = parseTime(this.config.dateFormatThreshold);
    this.timeFormatThreshold = parseTime(this.config.timeFormatThreshold);
    this.styleThresholds = objToArr(
      this.config.styleThresholds,
      (val, key) => (
        {
          threshold: parseTime(key),
          classes: Array.isArray(val) ? val : [val]
        }
      )
    );
    this.styleThresholds.sort(sortNumDesc(x => x.threshold));
    this.padLength = this.config.padNumbers ? 2 : 1;
    this.fillerNum = this.config.padNumbers ? '00' : '0';

    if (this.config.display === "default") {
      this.showHours = true;
      this.forceHours = false;
      this.showMinutes = true;
      this.forceMinutes = true;
    } else if (this.config.display === "dynamic") {
      this.showHours = true;
      this.forceHours = false;
      this.showMinutes = true;
      this.forceMinutes = false;
    } else {
      this.showHours = this.config.display === 'hours';
      this.forceHours = this.showHours;
      this.showMinutes = this.config.display === 'hours' || this.config.display === 'minutes';
      this.forceMinutes = this.showMinutes;
    }
  }

  //</editor-fold>

  //<editor-fold desc="Rendering">
  private render(time: number) {
    this.applyClasses(time);
    this.renderCountdown(this.formatTime(time));
  }

  private formatTime(time: number): [boolean, string | undefined, string | undefined, string] {
    let output = new Array(4);

    output[0] = time >= 0;
    time = Math.abs(time);

    if (time >= HOUR) {
      output[1] = Math.floor(time / HOUR).toString().padStart(this.padLength, '0');
      time = time % HOUR
    } else {
      output[1] = undefined;
    }

    if (time >= MINUTE || output[1] !== undefined) {
      output[2] = Math.floor(time / MINUTE).toString().padStart(this.padLength, '0');
      time = time % MINUTE;
    } else {
      output[2] = undefined;
    }

    output[3] = Math.floor(time).toString().padStart(this.padLength, '0');

    return output as [boolean, string | undefined, string | undefined, string];
  }

  private renderDate() {
    this.element.classList.remove(['ngx-counting', 'ngx-time']);
    this.element.classList.add(['ngx-date']);
    this.dateTimeNode.innerText = formatDate(this.endTime, 'short', this.locale);
  }

  private renderTime() {
    this.element.classList.remove(['ngx-counting', 'ngx-date']);
    this.element.classList.add(['ngx-time']);
    this.dateTimeNode.innerText = formatDate(this.endTime, 'shortTime', this.locale);
  }

  private countdownStarted() {
    this.element.classList.remove(['ngx-time', 'ngx-date']);
    this.element.classList.add(['ngx-counting']);
  }

  appliedClasses?: string[];

  private resetClasses() {
    if (!this.appliedClasses) return;
    this.element.classList.remove(...this.appliedClasses);
  }

  private applyClasses(time: number) {
    if (!this.styleThresholds.length) return;

    if (this.styleIndex >= this.styleThresholds.length) {
      this.styleIndex = this.styleThresholds.length - 2;
    }

    let classes: string[] | undefined = undefined;

    for (let i = this.styleIndex + 1; i < this.styleThresholds.length; i++) {
      const item = this.styleThresholds[i]!;
      if (time > item.threshold) break;
      this.styleIndex = i;
      classes = item.classes;
    }

    if (!classes) return;

    this.resetClasses();
    this.element.classList.add(...this.styleThresholds[this.styleIndex]!.classes);
    this.appliedClasses = this.styleThresholds[this.styleIndex]!.classes;
  }

  private renderCountdown([positive, hours, minutes, seconds]: [boolean, string | undefined, string | undefined, string]) {
    this.element.classList.toggle('ngx-negative', !positive);
    this.hourNode.innerText = !this.showHours ? '' : hours ?? (this.forceHours ? this.fillerNum : '');
    this.minuteNode.innerText = !this.showMinutes ? '' : minutes ?? (this.forceMinutes ? this.fillerNum : '');
    this.secondNode.innerText = seconds;
  }

  //</editor-fold>
}

function parseTime(input: string | number) {
  if (typeof input === 'number') return input;

  let segments = input.split(':');
  if (segments.length > 3) segments = segments.slice(-3);

  let time = 0;

  for (let i = 0; i < segments.length; i++) {
    let number = Number(segments[i]);
    if (Number.isNaN(number)) number = 0;
    const weight = Math.pow(MINUTE, segments.length - i - 1);
    time += weight * number;
  }

  return time;
}

export type CountdownOptions = Partial<CountdownConfig>;

export interface CountdownConfig {
  dateFormatThreshold: string | number;
  timeFormatThreshold: string | number;
  styleThresholds: Record<string | number, string | string[]>;
  display: 'default'|'dynamic'|'hours'|'minutes'|'seconds';
  padNumbers: boolean;
  countNegative: boolean;
}

export const defaultCountdownConfig: CountdownConfig = {
  dateFormatThreshold: DAY,
  timeFormatThreshold: HOUR,
  styleThresholds: {
    '0:10': 'critical',
    '1:00': 'close',
    '2:00': 'low',
    '10:00': 'medium',
  },
  display: 'default',
  padNumbers: true,
  countNegative: false
}
