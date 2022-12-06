import {ApplicationRef, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwUpdateButtonComponent} from "./components/sw-update-button/sw-update-button.component";
import {FalsyPipe, TruthyPipe} from '@consensus-labs/ngx-tools';
import {NgxDialogModule} from '@consensus-labs/ngx-material';
import {ServiceWorkerAlertComponent} from "./components/service-worker-alert/service-worker-alert.component";
import {ServiceWorkerService} from "./services/service-worker.service";
import {SwUpdate} from "@angular/service-worker";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";


@NgModule({
  declarations: [
    SwUpdateButtonComponent,
    ServiceWorkerAlertComponent
  ],
  exports: [
    SwUpdateButtonComponent,
    ServiceWorkerAlertComponent
  ],
  imports: [
    CommonModule,
    TruthyPipe,
    FalsyPipe,
    MatLegacyButtonModule,
    NgxDialogModule
  ]
})
export class NgxServiceWorkerModule {
  static register(enabled: boolean): ModuleWithProviders<NgxServiceWorkerModule> {
    return {
      ngModule: NgxServiceWorkerModule,
      providers: [
        {
          provide: ServiceWorkerService,
          useFactory: (ref: ApplicationRef, update: SwUpdate) => new ServiceWorkerService(update, ref, enabled),
          deps: [ApplicationRef, SwUpdate]
        }
      ]
    };
  }
}
