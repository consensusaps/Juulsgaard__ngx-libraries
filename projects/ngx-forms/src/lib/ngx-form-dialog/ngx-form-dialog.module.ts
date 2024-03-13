import {NgModule} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {FormDialogComponent} from "./components/form-dialog/form-dialog.component";
import {FalsyPipe, LoadingDirective, NgxIfDirective, NgxRenderingModule} from "@juulsgaard/ngx-tools";
import {FormInputDirective} from "../../directives";
import {FormDialogDirective} from "./directives/dialog-form.directive";
import {MatButton} from "@angular/material/button";


@NgModule({
  declarations: [
    FormDialogComponent,
    FormDialogDirective
  ],
  exports: [
    FormDialogComponent,
    FormDialogDirective
  ],
  imports: [
    NgxRenderingModule,
    NgIf,
    NgxRenderingModule,
    AsyncPipe,
    FormInputDirective,
    MatButton,
    LoadingDirective,
    FalsyPipe,
    NgxIfDirective
  ]
})
export class NgxFormDialogModule { }
