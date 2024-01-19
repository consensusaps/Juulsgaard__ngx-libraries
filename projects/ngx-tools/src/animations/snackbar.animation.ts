import {animate, group, style, transition, trigger} from "@angular/animations";
import {cubicInOut} from "./easings";

export function snackbarAnimation(duration = 400) {
  const halfDuration = (duration / 2).toFixed(0);
  return trigger('snackbar', [
    transition('void => *', [
      style({opacity: 0, height: 0, minHeight: 0, marginTop: 0, marginBottom: 0}),
      animate(`${duration}ms ${cubicInOut}`, style({opacity: '*', height: '*', minHeight: '*', marginTop: '*', marginBottom: '*'}))
    ]),
    transition('none => void', [
      style({opacity: '*', height: '*', minHeight: '*', marginTop: '*', marginBottom: '*'}),
      animate(`${duration}ms ${cubicInOut}`, style({opacity: 0, height: 0, minHeight: 0, marginTop: 0, marginBottom: 0}))
    ]),
    transition('left => void', [
      style({opacity: '*', transform: '*', height: '*', minHeight: '*', marginTop: '*', marginBottom: '*'}),
      group([
        animate(`${halfDuration}ms ease-out`, style({opacity: 0})),
        animate(`${duration}ms ease-out`, style({transform: 'translateX(-100%)'})),
        animate(`${duration}ms ${halfDuration}ms ease-out`, style({height: 0, minHeight: 0, marginTop: 0, marginBottom: 0})),
      ])
    ]),
    transition('right => void', [
      style({opacity: '*', transform: '*', height: '*', minHeight: '*', marginTop: '*', marginBottom: '*'}),
      group([
        animate(`${halfDuration}ms ease-out`, style({opacity: 0})),
        animate(`${duration}ms ease-out`, style({transform: 'translateX(100%)'})),
        animate(`${duration}ms ${halfDuration}ms ease-out`, style({height: 0, minHeight: 0, marginTop: 0, marginBottom: 0})),
      ])
    ]),
  ]);
}
