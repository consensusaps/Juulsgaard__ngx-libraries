import {Directive} from "@angular/core";
import {NgxFormCardDescriptionDirective} from "./form-card-description.directive";

@Directive({
  selector: '[form-card-text]',
  host: {class: 'ngx-form-card-text'}
})
export class NgxFormCardTextDirective {
  constructor() {
  }
}
