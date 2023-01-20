import {ContentChild, Directive, ViewContainerRef} from '@angular/core';
import {DialogFooterDirective} from "./dialog-footer.directive";
import {DialogContentDirective} from "./dialog-content.directive";
import {BaseDialogDirective} from "./base-dialog.directive";
import {DialogManagerService} from "../services/dialog-manager.service";

@Directive({selector: 'ngx-template-dialog'})
export class TemplateDialogDirective extends BaseDialogDirective {

  @ContentChild(DialogFooterDirective) set footer(item: DialogFooterDirective | undefined) {
    this.footer$.next(item?.template);
  };

  @ContentChild(DialogFooterDirective) set content(item: DialogContentDirective | undefined) {
    if (!item?.template) return;
    this.content$.next(item.template);
  };


  constructor(viewContainer: ViewContainerRef, manager: DialogManagerService) {
    super(viewContainer, manager);
  }
}

