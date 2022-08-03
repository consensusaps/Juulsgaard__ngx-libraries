import {Directive} from "@angular/core";

@Directive({
  selector: '[form-card-warning]',
  host: {class: 'ngx-form-card-warning'}
})
export class NgxFormCardWarningDirective {
  constructor() {
  }
}
