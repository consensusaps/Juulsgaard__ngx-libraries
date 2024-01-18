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
export class SnackbarOutletModule {

  public static AsIsolatedScope(): ModuleWithProviders<SnackbarOutletModule> {
    return {
      ngModule: SnackbarOutletModule,
      providers: [SnackbarManagerService, SnackbarService]
    }
  }

}
