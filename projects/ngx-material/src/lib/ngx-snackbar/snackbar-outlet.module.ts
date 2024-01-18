import {ModuleWithProviders, NgModule} from '@angular/core';
import {SnackbarManagerService, SnackbarService} from "./services";
import {SnackbarOutletDirective} from "./directives";

@NgModule({
  imports: [],
  exports: [
    SnackbarOutletDirective
  ],
  declarations: [SnackbarOutletDirective],
  providers: [],
})
export class NgxSnackbarOutletModule {

  public static AsIsolatedScope(): ModuleWithProviders<NgxSnackbarOutletModule> {
    return {
      ngModule: NgxSnackbarOutletModule,
      providers: [SnackbarManagerService, SnackbarService]
    }
  }

}
