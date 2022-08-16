import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ServiceWorkerService} from "../../services/service-worker.service";

@Component({
  selector: 'ngx-sw-update-button',
  templateUrl: './sw-update-button.component.html',
  styleUrls: ['./sw-update-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwUpdateButtonComponent {

  constructor(public swService: ServiceWorkerService) {
  }

  async checkForUpdate() {
    await this.swService.checkForUpdate();
  }

  async updateApp() {
    await this.swService.updateApp();
  }
}
