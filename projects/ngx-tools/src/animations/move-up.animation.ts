import {animate, style, transition, trigger} from "@angular/animations";

export function moveUpAnimation(duration = 200) {
  return trigger('moveUp', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(5vh)'}),
      animate(`${duration}ms ease-out`, style({opacity: '*', transform: '*'}))
    ]),
    transition(':leave', [
      animate(`${duration}ms linear`, style({opacity: 0, transform: 'translateY(-2vh)'}))
    ])
  ]);
}
