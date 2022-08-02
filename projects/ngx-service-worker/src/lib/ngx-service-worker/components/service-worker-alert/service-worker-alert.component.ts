import {Component} from '@angular/core';
import {first} from "rxjs/operators";
import {ServiceWorkerService} from "../../services/service-worker.service";

@Component({
  selector: 'ngx-service-worker-alert',
  templateUrl: './service-worker-alert.component.html',
  styleUrls: ['./service-worker-alert.component.scss']
})
export class ServiceWorkerAlertComponent {

  showUpdateDialog = false;

  constructor(public swService: ServiceWorkerService) {
    swService.updateReady$.pipe(first(x => x)).subscribe(() => this.showUpdateDialog = true);
  }

  async updateApp() {
    await this.swService.updateApp();
  }
}
