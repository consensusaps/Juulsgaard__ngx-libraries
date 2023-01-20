import {Directive, Optional, TemplateRef} from '@angular/core';

@Directive({selector: '[dialogFooter]'})
export class DialogFooterDirective {

  constructor(@Optional() public template: TemplateRef<void>) {
  }
}
