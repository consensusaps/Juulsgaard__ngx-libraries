import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {RenderSource} from "@consensus-labs/ngx-tools";

@Directive({selector: '[dialog-footer-tmpl]'})
export class DialogFooterTemplateDirective implements RenderSource {
  constructor(
    public readonly template: TemplateRef<void>,
    public readonly viewContainer: ViewContainerRef
  ) {
  }
}
