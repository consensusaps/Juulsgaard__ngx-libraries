import {NgModule} from '@angular/core';
import {NgxDragDirective} from "./directives/ngx-drag.directive";
import {NgxDropAreaDirective} from "./directives/ngx-drop-area.directive";


@NgModule({
  declarations: [
    NgxDragDirective,
    NgxDropAreaDirective
  ],
  exports: [
    NgxDragDirective,
    NgxDropAreaDirective
  ]
})
export class NgxDragModule { }
