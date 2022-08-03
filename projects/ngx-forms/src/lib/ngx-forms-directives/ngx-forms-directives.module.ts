import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormDirective} from "./directives/form.directive";
import {FormLayerDirective} from "./directives/form-layer.directive";
import {FormListDirective} from "./directives/form-list.directive";



@NgModule({
  declarations: [
    FormDirective,
    FormLayerDirective,
    FormListDirective
  ],
  exports: [
    FormDirective,
    FormLayerDirective,
    FormListDirective
  ],
  imports: [
    CommonModule
  ]
})
export class NgxFormsDirectivesModule { }
