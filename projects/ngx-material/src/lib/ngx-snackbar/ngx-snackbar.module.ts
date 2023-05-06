import {NgModule} from '@angular/core';
import {SnackbarService} from "./services/snackbar.service";
import {PlainSnackComponent} from "./components/plain-snack/plain-snack.component";
import {ErrorSnackComponent} from "./components/error-snack/error-snack.component";
import {IconDirective} from "@consensus-labs/ngx-tools";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  imports: [CommonModule, MatSnackBarModule, MatButtonModule, IconDirective],
  declarations: [PlainSnackComponent, ErrorSnackComponent],
  providers: [SnackbarService],
})
export class NgxSnackbarModule {
}
