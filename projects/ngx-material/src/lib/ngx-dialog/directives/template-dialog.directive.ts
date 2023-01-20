import {ContentChild, Directive, ViewContainerRef} from '@angular/core';
import {DialogFooterDirective} from "./dialog-footer.directive";
import {DialogContentTemplateDirective} from "./dialog-content-template.directive";
import {BaseDialogDirective} from "./base-dialog.directive";
import {DialogManagerService} from "../services/dialog-manager.service";
import {DialogFooterTemplateDirective} from "./dialog-footer-template.directive";

@Directive({selector: 'ngx-template-dialog'})
export class TemplateDialogDirective extends BaseDialogDirective {

  @ContentChild(DialogFooterDirective) set footer(item: DialogFooterTemplateDirective | undefined) {
    this.footer$.next(item?.template);
  };

  @ContentChild(DialogFooterDirective) set content(item: DialogContentTemplateDirective | undefined) {
    if (!item?.template) return;
    this.content$.next(item.template);
  };


  constructor(viewContainer: ViewContainerRef, manager: DialogManagerService) {
    super(viewContainer, manager);
  }
}

