import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {elementClassManager} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'ngx-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule
  ]
})
export class LoadingOverlayComponent {

  readonly type: InputSignal<"content" | "fixed" | "absolute"> = input<'content'|'fixed'|'absolute'>('fixed');

  constructor() {
    elementClassManager(this.type);
  }

}
