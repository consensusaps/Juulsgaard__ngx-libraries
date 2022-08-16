import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {first} from "rxjs/operators";
import {ServiceWorkerService} from "../../services/service-worker.service";

@Component({
  selector: 'ngx-service-worker-alert',
  templateUrl: './service-worker-alert.component.html',
  styleUrls: ['./service-worker-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceWorkerAlertComponent {

  showUpdateDialog = false;

  constructor(public swService: ServiceWorkerService, private changes: ChangeDetectorRef) {
    swService.updateReady$.pipe(first(x => x)).subscribe(() => {
      this.showUpdateDialog = true;
      this.changes.markForCheck();
    });
  }

  async updateApp() {
    await this.swService.updateApp();
  }

  closeDialog() {
    this.showUpdateDialog = false;
    this.changes.markForCheck();
  }
}
