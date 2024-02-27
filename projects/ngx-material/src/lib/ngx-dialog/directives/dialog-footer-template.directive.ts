import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {RenderSource} from "@juulsgaard/ngx-tools";

@Directive({selector: '[dialog-footer-tmpl]'})
export class DialogFooterTemplateDirective implements RenderSource {
  constructor(
    public readonly template: TemplateRef<{}>,
    public readonly viewContainer: ViewContainerRef
  ) {
  }
}
