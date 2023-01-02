import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatLegacyProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";

@Component({
  selector: 'ngx-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatLegacyProgressSpinnerModule
  ],
  host: {'[class]': 'type'}
})
export class LoadingOverlayComponent {

  @Input() type: 'content'|'fixed'|'absolute' = 'fixed';

  constructor() { }

}
