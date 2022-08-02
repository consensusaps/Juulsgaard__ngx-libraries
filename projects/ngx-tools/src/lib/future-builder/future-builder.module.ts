import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WhenLoadingDirective} from "./directives/when-loading.directive";
import {WhenEmptyDirective} from "./directives/when-empty.directive";
import {FutureDirective} from "./directives/future.directive";
import {WhenDataDirective} from "./directives/when-data.directive";
import {WhenErrorDirective} from "./directives/when-error.directive";
import {WhenEmptyLoadingDirective} from "./directives/when-empty-loading.directive";
import {WhenLoadingOverlayDirective} from "./directives/when-loading-overlay.directive";
import {WhenEmptyErrorDirective} from "./directives/when-empty-error.directive";
import {WhenErrorOverlayDirective} from "./directives/when-error-overlay.directive";



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
