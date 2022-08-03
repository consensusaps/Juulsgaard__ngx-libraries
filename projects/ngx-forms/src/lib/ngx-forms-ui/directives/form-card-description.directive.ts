import {Directive} from "@angular/core";

@Directive({
  selector: '[form-card-description]',
  host: {class: 'ngx-form-card-description'}
})
export class NgxFormCardDescriptionDirective {
  constructor() {
  }
}
