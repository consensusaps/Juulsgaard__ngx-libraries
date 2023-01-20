import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[dialog-content-tmpl]'})
export class DialogContentTemplateDirective {

  constructor(public template: TemplateRef<void>) {
  }

}
