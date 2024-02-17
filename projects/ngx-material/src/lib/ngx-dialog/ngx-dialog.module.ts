import {NgModule} from '@angular/core';
import {DialogComponent} from "./components/dialog/dialog.component";
import {DialogFooterDirective} from "./directives/dialog-footer.directive";
import {DialogContentTemplateDirective} from "./directives/dialog-content-template.directive";
import {DialogFooterTemplateDirective} from "./directives/dialog-footer-template.directive";
import {NgxRenderingModule} from "@juulsgaard/ngx-tools";
import {DialogDirective} from "./directives/dialog.directive";


@NgModule({
  declarations: [
    DialogComponent,
    DialogFooterDirective,
    DialogContentTemplateDirective,
    DialogFooterTemplateDirective,
    DialogDirective,
  ],
  exports: [
    DialogComponent,
    DialogFooterDirective,
    DialogContentTemplateDirective,
    DialogFooterTemplateDirective,
    DialogDirective,
  ],
  imports: [
    NgxRenderingModule
  ]
})
export class NgxDialogModule { }
