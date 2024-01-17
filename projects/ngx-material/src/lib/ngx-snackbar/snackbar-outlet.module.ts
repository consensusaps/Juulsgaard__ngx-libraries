import {ModuleWithProviders, NgModule} from '@angular/core';
import {SnackbarManagerService} from "./services/snackbar-manager.service";
import {SnackbarOutletDirective} from "./directives/snackbar-outlet.directive";
import {SnackbarService} from "./services/snackbar.service";

@NgModule({
  imports: [],
  exports: [
    SnackbarOutletDirective
  ],
  declarations: [SnackbarOutletDirective],
  providers: [],
})
export class SnackbarOutletModule {

  public static AsIsolatedScope(): ModuleWithProviders<SnackbarOutletModule> {
    return {
      ngModule: SnackbarOutletModule,
      providers: [SnackbarManagerService, SnackbarService]
    }
  }

}
