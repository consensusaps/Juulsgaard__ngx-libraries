import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxFormCardTitleDirective} from "./directives/form-card-title.directive";
import {NgxFormCardDescriptionDirective} from "./directives/form-card-description.directive";
import {NgxFormCardTextDirective} from "./directives/form-card-text.directive";
import {NgxFormCardWarningDirective} from "./directives/form-card-warning.directive";
import {FormCardComponent} from "./components/form-card/form-card.component";



@NgModule({
  declarations: [
    NgxFormCardTitleDirective,
    NgxFormCardDescriptionDirective,
    NgxFormCardTextDirective,
    NgxFormCardWarningDirective,
    FormCardComponent
  ],
  exports: [
    NgxFormCardTitleDirective,
    NgxFormCardDescriptionDirective,
    NgxFormCardTextDirective,
    NgxFormCardWarningDirective,
    FormCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NgxFormsUiModule { }
