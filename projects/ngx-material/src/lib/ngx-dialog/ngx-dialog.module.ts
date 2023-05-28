import {NgModule} from '@angular/core';
import {DialogComponent} from "./components/dialog/dialog.component";
import {DialogFooterDirective} from "./directives/dialog-footer.directive";
import {DialogContentTemplateDirective} from "./directives/dialog-content-template.directive";
import {DialogFooterTemplateDirective} from "./directives/dialog-footer-template.directive";
import {NgxRenderingModule} from "@consensus-labs/ngx-tools";


@NgModule({
  declarations: [
    DialogComponent,
    DialogFooterDirective,
    DialogContentTemplateDirective,
    DialogFooterTemplateDirective
  ],
  exports: [
    DialogComponent,
    DialogFooterDirective,
    DialogContentTemplateDirective,
    DialogFooterTemplateDirective,
  ],
  imports: [
    NgxRenderingModule
  ]
})
export class NgxDialogModule { }
