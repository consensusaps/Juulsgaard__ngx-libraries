import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ServiceWorkerService} from "../../services/service-worker.service";

@Component({
  selector: 'ngx-service-worker-alert',
  templateUrl: './service-worker-alert.component.html',
  styleUrls: ['./service-worker-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceWorkerAlertComponent {

  private swService = inject(ServiceWorkerService);

  readonly hideDialog = signal(false);
  readonly showDialog = computed(() => !this.hideDialog() && this.swService.updateReady());
  readonly brokenState = this.swService.brokenState;

  async updateApp() {
    await this.swService.updateApp();
  }

  closeDialog() {
    this.hideDialog.set(true);
  }
}
