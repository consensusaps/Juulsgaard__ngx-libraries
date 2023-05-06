import {ApplicationRef, ModuleWithProviders, NgModule, NgZone} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwUpdateButtonComponent} from "./components/sw-update-button/sw-update-button.component";
import {FalsyPipe, IconDirective, TruthyPipe} from '@consensus-labs/ngx-tools';
import {NgxDialogModule} from '@consensus-labs/ngx-material';
import {ServiceWorkerAlertComponent} from "./components/service-worker-alert/service-worker-alert.component";
import {ServiceWorkerService} from "./services/service-worker.service";
import {SwUpdate} from "@angular/service-worker";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


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
    MatButtonModule,
    NgxDialogModule,
    MatIconModule,
    IconDirective
  ]
})
export class NgxServiceWorkerModule {
  static register(enabled: boolean): ModuleWithProviders<NgxServiceWorkerModule> {
    return {
      ngModule: NgxServiceWorkerModule,
      providers: [
        {
          provide: ServiceWorkerService,
          useFactory: (ref: ApplicationRef, update: SwUpdate, zone: NgZone) => new ServiceWorkerService(update, ref, zone, enabled),
          deps: [ApplicationRef, SwUpdate, NgZone]
        }
      ]
    };
  }
}
