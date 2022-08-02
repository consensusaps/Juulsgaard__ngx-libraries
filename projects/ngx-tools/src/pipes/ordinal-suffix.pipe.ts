import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ordinal',
  standalone: true
})
export class OrdinalSuffixPipe implements PipeTransform {

  transform(num: number): string {
    if (num > 3 && num < 21) return 'th';
    switch (num % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

}
