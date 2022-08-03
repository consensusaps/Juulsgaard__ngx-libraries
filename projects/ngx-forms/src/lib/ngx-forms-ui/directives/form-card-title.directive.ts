import {Directive} from '@angular/core';
import {NgxFormCardDescriptionDirective} from "./form-card-description.directive";

@Directive({
  selector: '[form-card-title]',
  host: {class: 'ngx-form-card-title'}
})
export class NgxFormCardTitleDirective {
  constructor() {
  }
}
