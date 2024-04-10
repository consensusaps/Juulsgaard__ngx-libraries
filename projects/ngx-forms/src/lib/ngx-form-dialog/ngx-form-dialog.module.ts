import {NgModule} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {FormDialogComponent} from "./components/form-dialog/form-dialog.component";
import {LoadingDirective, NgxRenderingModule} from "@juulsgaard/ngx-tools";
import {FormInputDirective} from "../../directives";
import {FormDialogDirective} from "./directives/dialog-form.directive";
import {MatButton} from "@angular/material/button";
import {FormErrorsComponent} from "../../components/form-errors/form-errors.component";
import {FormErrorStateComponent} from "../../components/form-error-state/form-error-state.component";


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
    FormErrorsComponent,
    FormErrorStateComponent,
  ]
})
export class NgxFormDialogModule { }
