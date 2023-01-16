import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from "./components/dialog/dialog.component";
import {DialogFooterDirective} from "./directives/dialog-footer.directive";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {DialogOutletDirective} from './directives/dialog-outlet.directive';
import {RenderDialogComponent} from './components/render-dialog/render-dialog.component';
import {TruthyPipe} from "@consensus-labs/ngx-tools";


@NgModule({
  declarations: [
    DialogComponent,
    DialogFooterDirective,
    DialogOutletDirective,
    RenderDialogComponent
  ],
  exports: [
    DialogComponent,
    DialogFooterDirective,
    DialogOutletDirective
  ],
  imports: [
    CommonModule,
    MatLegacyButtonModule,
    TruthyPipe
  ]
})
export class NgxDialogModule { }
