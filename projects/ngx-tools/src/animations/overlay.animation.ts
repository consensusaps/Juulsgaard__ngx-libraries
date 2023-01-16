import {animate, group, query, style, transition, trigger} from "@angular/animations";

export function overlayAnimation() {
  return trigger('overlay', [

    // Animated Enter
    transition('void => true', [
      group([
        // Fade in
        query('.ngx-fade', [
          style({opacity: 0}),
          animate(`100ms linear`, style({opacity: '*'}))
        ], {optional: true}),
        // Move up
        query('.ngx-move-up', [
          style({opacity: 0, transform: 'translateY(5vh)'}),
          animate(`200ms ease-out`, style({opacity: '*', transform: '*'}))
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
        query('.ngx-move-up', [
          style({opacity: 0}),
          animate(`20ms linear`, style({opacity: '*'}))
        ], {optional: true}),
      ])
    ]),

    // Animated exit
    transition('true => void', [
      group([
        query('.ngx-move-up', [
          animate(`200ms ease-in`, style({opacity: 0, transform: 'translateY(2vh)'}))
        ], {optional: true}),
        query('.ngx-fade', [
          animate(`100ms linear`, style({opacity: 0}))
        ], {optional: true}),
      ])
    ]),

    // Non-animated exit
    transition('false => void', [
      group([
        query('.ngx-move-up', [
          animate(`100ms 200ms linear`, style({opacity: 0}))
        ], {optional: true}),
        query('.ngx-fade', [
          animate(`100ms linear`, style({opacity: 0}))
        ], {optional: true}),
      ])
    ])
  ])
}
