import {animate, group, query, style, transition, trigger} from "@angular/animations";
import {cubicInOut} from "./easings";

export function sideMenuAnimation() {
  return trigger('sideMenu', [

    // Animated Enter
    transition('void => true', [
      group([
        // Fade in
        query('.ngx-fade', [
          style({opacity: 0}),
          animate(`100ms linear`, style({opacity: '*'}))
        ], {optional: true}),
        // Move in
        query('.ngx-move-in', [
          style({transform: 'translate(100%, 0)'}),
          animate(`200ms ${cubicInOut}`, style({transform: 'translate(0, 0)'}))
        ], {optional: true}),
      ])
    ]),

    // Non-animated Enter
    transition('void => false', [
      group([
        // Fade in
        query('.ngx-fade', [
          style({opacity: 0}),
          animate(`100ms linear`, style({opacity: '*'}))
        ], {optional: true}),
        // Fade in fast
        query('.ngx-move-in', [
          style({opacity: 0}),
          animate(`20ms linear`, style({opacity: '*'}))
        ], {optional: true}),
      ])
    ]),

    // Animated exit
    transition('true => void', [
      group([
        query('.ngx-move-in', [
          style({transform: 'translate(0, 0)'}),
          animate(`200ms ${cubicInOut}`, style({transform: 'translate(100%, 0)'}))
        ], {optional: true}),
        query('.ngx-fade', [
          animate(`100ms linear`, style({opacity: 0}))
        ], {optional: true}),
      ])
    ]),

    // Non-animated exit
    transition('false => void', [
      group([
        query('.ngx-move-in', [
          animate(`100ms 200ms linear`, style({opacity: 0}))
        ], {optional: true}),
        query('.ngx-fade', [
          animate(`100ms linear`, style({opacity: 0}))
        ], {optional: true}),
      ])
    ])
  ])
}
