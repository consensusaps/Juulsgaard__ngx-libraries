import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from "./components/dialog/dialog.component";
import {DialogFooterDirective} from "./directives/dialog-footer.directive";
import {PopupControllerComponent} from "./components/popup-controller/popup-controller.component";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";


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
    MatLegacyButtonModule
  ]
})
export class NgxDialogModule { }
