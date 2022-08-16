import {Pipe, PipeTransform} from '@angular/core';
import {secondsToTimeAgo} from "../helpers/time-ago";

/**
 * A pipe that will output the time since the provided date.
 * Will not update. If you want updating values use the directive instead.
 */
@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string | undefined) {

    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);

    const now = Date.now();

    const secondsElapsed = (now - date.getTime()) / 1000;
    const inFuture = secondsElapsed < 0;
    const seconds = Math.round(Math.abs(secondsElapsed));

    return secondsToTimeAgo(seconds, inFuture);
  }
}
