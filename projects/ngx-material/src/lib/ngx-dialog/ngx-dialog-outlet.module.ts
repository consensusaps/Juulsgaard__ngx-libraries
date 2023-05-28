import {NgModule} from '@angular/core';
import {DialogOutletDirective} from "./directives/dialog-outlet.directive";
import {RenderDialogComponent} from "./components/render-dialog/render-dialog.component";
import {NgxRenderingModule, TruthyPipe} from "@consensus-labs/ngx-tools";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@NgModule({
  imports: [
    NgxRenderingModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    NgForOf,
    TruthyPipe
  ],
  exports: [DialogOutletDirective],
  declarations: [DialogOutletDirective, RenderDialogComponent],
  providers: [],
})
export class NgxDialogOutletModule {
}
