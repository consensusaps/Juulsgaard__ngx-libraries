import {ChangeDetectorRef, NgZone, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false
})
export class TimeAgoPipe implements PipeTransform {

  private static readonly minute = 60;
  private static readonly hour = 60 * 60;
  private static readonly day = 60 * 60 * 24;

  private timer?: number;

  constructor(private changes: ChangeDetectorRef, private zone: NgZone) {
  }

  transform(value: Date | string | undefined) {
    console.log(value);
    clearTimeout(this.timer);

    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);

    const now = Date.now();

    const secondsElapsed = (now - date.getTime()) / 1000;
    const inFuture = secondsElapsed < 0;
    const seconds = Math.round(Math.abs(secondsElapsed));

    this.zone.runOutsideAngular(() => {
      const delay = TimeAgoPipe.getSecondsUntilUpdate(seconds) * 1000;

      this.timer = setTimeout(() => {
        console.log('refresh')
        this.zone.run(() => this.changes.markForCheck());
      }, delay)
    })

    if (seconds <= 5) return 'now';

    const base = TimeAgoPipe.getBaseString(seconds);
    return inFuture ? `in ${base}` : `${base} ago`;
  }

  private static getBaseString(seconds: number) {

    if (seconds <= 45) return 'a few seconds';

    if (seconds <= 90) return 'a minute';

    const minutes = Math.round(Math.abs(seconds / 60));

    if (minutes <= 45) return `${minutes} minutes`;

    if (minutes <= 90) return 'an hour';

    const hours = Math.round(Math.abs(minutes / 60));

    if (hours <= 22) return `${hours} hours`;

    if (hours <= 36) return 'a day';

    const days = Math.round(Math.abs(hours / 24));

    if (days <= 25) return `${days} days`;

    if (days <= 45) return 'a month';

    const months = Math.round(Math.abs(days / 30.416));

    if (days <= 345) return `${months} months`;

    if (days <= 545) return 'a year';

    const years = Math.round(Math.abs(days / 365));

    return `${years} years`;
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  private static getSecondsUntilUpdate(seconds: number) {

    // less than 1 min, update every 2 secs
    if (seconds < TimeAgoPipe.minute) return 2;

    // less than an hour, update every 30 secs
    if (seconds < TimeAgoPipe.hour) return 30;

    // less than a day, update every 5 mins
    if (seconds < TimeAgoPipe.day) return 300;

    // update every hour
    return 3600;
  }
}
