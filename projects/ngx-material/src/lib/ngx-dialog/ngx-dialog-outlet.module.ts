import {NgModule} from '@angular/core';
import {DialogOutletDirective} from "./directives/dialog-outlet.directive";
import {RenderDialogComponent} from "./components/render-dialog/render-dialog.component";
import {NgxAsyncDirective, NgxIfDirective, NgxRenderingModule, TruthyPipe} from "@juulsgaard/ngx-tools";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@NgModule({
  imports: [
    NgxRenderingModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    NgForOf,
    TruthyPipe,
    NgxAsyncDirective,
    NgxIfDirective
  ],
  exports: [DialogOutletDirective],
  declarations: [DialogOutletDirective, RenderDialogComponent],
  providers: [],
})
export class NgxDialogOutletModule {
}
