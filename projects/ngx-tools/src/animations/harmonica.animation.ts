import {animate, state, style, transition, trigger} from '@angular/animations';
import {cubicInOut} from "./easings";

export function harmonicaAnimation(duration = 400) {
  return trigger('harmonica', [
    state('true', style({
      height: '*',
      'padding-top': '*',
      'margin-top': '*',
      'padding-bottom': '*',
      'margin-bottom': '*',
      'box-shadow': '*',
      'min-height': '*'
    })),
    state('false', style({
      height: 0,
      'padding-top': 0,
      'margin-top': 0,
      'padding-bottom': 0,
      'margin-bottom': 0,
      'box-shadow': 'none',
      'min-height': 0,
      'overflow': 'hidden'
    })),
    transition('true => false', [
      style({overflow: 'hidden'}),
      animate(`${duration}ms ${cubicInOut}`, style({
        height: 0,
        'padding-top': 0,
        'margin-top': 0,
        'padding-bottom': 0,
        'margin-bottom': 0,
        'box-shadow': 'none',
        'min-height': 0,
      })),
      style({overflow: 'hidden'}),
    ]),
    transition('false => true', [
      style({overflow: 'hidden'}),
      animate(`${duration}ms ${cubicInOut}`, style({
        height: '*',
        'padding-top': '*',
        'margin-top': '*',
        'padding-bottom': '*',
        'margin-bottom': '*',
        'box-shadow': '*',
        'min-height': '*'
      })),
      style({overflow: '*'})
    ])
  ]);
}
