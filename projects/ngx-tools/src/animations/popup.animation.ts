import {animate, group, query, style, transition, trigger} from "@angular/animations";
import {quadInOut} from "./easings";

export const popupAnimation = [
    trigger('background', [
        transition(':enter', [
            style({opacity: 0}),
            animate(`300ms ${quadInOut}`, style({opacity: '*'}))
        ])
    ]),
    trigger('content', [
        transition(':enter', [
            style({opacity: 0, transform: 'translateY(30px)'}),
            animate(`400ms ${quadInOut}`, style({opacity: '*', transform: 'translateY(0)'})),
        ]),
    ]),
    trigger('popup', [
        transition(':leave', [
            group([
                query('.ng-trigger-background', [
                    style({opacity: '*'}),
                    animate(`200ms ${quadInOut}`, style({opacity: 0}))
                ]),
                query('.ng-trigger-content', [
                    style({opacity: '*', transform: 'translateY(0)'}),
                    animate(`200ms ${quadInOut}`, style({opacity: 0, transform: 'translateY(30px)'}))
                ]),
            ])
        ])
    ])
];
