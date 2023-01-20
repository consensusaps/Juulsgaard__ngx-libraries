import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[dialogContent]'})
export class DialogContentDirective {

  constructor(public template: TemplateRef<void>) {
  }

}
