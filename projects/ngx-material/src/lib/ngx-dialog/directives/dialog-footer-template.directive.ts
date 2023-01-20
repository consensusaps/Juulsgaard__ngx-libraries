import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[dialog-footer-tmpl]'})
export class DialogFooterTemplateDirective {
  constructor(public template: TemplateRef<void>) {
  }
}
