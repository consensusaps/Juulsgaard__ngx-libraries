import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FutureDirective, WhenDataDirective, WhenEmptyDirective, WhenEmptyErrorDirective, WhenEmptyLoadingDirective, WhenErrorDirective,
  WhenErrorOverlayDirective, WhenLoadingDirective, WhenLoadingOverlayDirective
} from "./directives";


@NgModule({
  declarations: [
    FutureDirective,
    WhenLoadingDirective,
    WhenLoadingOverlayDirective,
    WhenDataDirective,
    WhenErrorDirective,
    WhenErrorOverlayDirective,
    WhenEmptyDirective,
    WhenEmptyLoadingDirective,
    WhenEmptyErrorDirective
  ],
  exports: [
    FutureDirective,
    WhenLoadingDirective,
    WhenLoadingOverlayDirective,
    WhenDataDirective,
    WhenErrorDirective,
    WhenErrorOverlayDirective,
    WhenEmptyDirective,
    WhenEmptyLoadingDirective,
    WhenEmptyErrorDirective
  ],
  imports: [
    CommonModule
  ]
})
export class FutureBuilderModule { }
