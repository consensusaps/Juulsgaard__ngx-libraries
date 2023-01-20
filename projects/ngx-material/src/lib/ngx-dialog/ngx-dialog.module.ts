import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from "./components/dialog/dialog.component";
import {DialogFooterDirective} from "./directives/dialog-footer.directive";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {DialogOutletDirective} from './directives/dialog-outlet.directive';
import {RenderDialogComponent} from './components/render-dialog/render-dialog.component';
import {NgxRenderingModule, TruthyPipe} from "@consensus-labs/ngx-tools";
import {DialogContentTemplateDirective} from "./directives/dialog-content-template.directive";
import {DialogFooterTemplateDirective} from "./directives/dialog-footer-template.directive";


@NgModule({
  declarations: [
    DialogComponent,
    DialogFooterDirective,
    DialogOutletDirective,
    RenderDialogComponent,
    DialogContentTemplateDirective,
    DialogFooterTemplateDirective,
  ],
  exports: [
    DialogComponent,
    DialogFooterDirective,
    DialogContentTemplateDirective,
    DialogOutletDirective,
    DialogFooterTemplateDirective,
  ],
  imports: [
    CommonModule,
    MatLegacyButtonModule,
    TruthyPipe,
    NgxRenderingModule,
  ]
})
export class NgxDialogModule { }
