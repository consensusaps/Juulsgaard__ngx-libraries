import {NgModule} from '@angular/core';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SnackbarService} from "./services/snackbar.service";
import {PlainSnackComponent} from "./components/plain-snack/plain-snack.component";
import {ErrorSnackComponent} from "./components/error-snack/error-snack.component";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {IconDirective} from "@consensus-labs/ngx-tools";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule, MatSnackBarModule, MatLegacyButtonModule, IconDirective],
  declarations: [PlainSnackComponent, ErrorSnackComponent],
  providers: [SnackbarService],
})
export class NgxSnackbarModule {
}
