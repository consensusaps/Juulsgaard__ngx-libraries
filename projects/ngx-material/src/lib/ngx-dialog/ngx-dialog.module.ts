import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogComponent} from "./components/dialog/dialog.component";
import {DialogFooterDirective} from "./directives/dialog-footer.directive";
import {PopupControllerComponent} from "./components/popup-controller/popup-controller.component";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    DialogComponent,
    DialogFooterDirective,
    PopupControllerComponent
  ],
  exports: [
    DialogComponent,
    DialogFooterDirective,
    PopupControllerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class NgxDialogModule { }
