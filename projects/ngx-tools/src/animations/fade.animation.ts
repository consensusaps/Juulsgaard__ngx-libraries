import {animate, style, transition, trigger} from "@angular/animations";

export function fadeAnimation(duration = 200) {
  return trigger('fade', [
    transition(':enter', [
      style({opacity: 0}),
      animate(`${duration}ms linear`, style({opacity: '*'}))
    ]),
    transition(':leave', [
      animate(`${duration}ms linear`, style({opacity: 0}))
    ])
  ]);
}

