import {animate, style, transition, trigger} from "@angular/animations";
import {cubicInOut} from "./easings";

export function hozCollapseAnimation(duration = 400) {
  return trigger('hozCollapse', [
    transition(':enter', [
      style({width: 0}),
      animate(`${duration}ms ${cubicInOut}`, style({width: '*'}))
    ]),
    transition(':leave',
      animate(`${duration}ms ${cubicInOut}`, style({width: 0}))
    )
  ]);
}
