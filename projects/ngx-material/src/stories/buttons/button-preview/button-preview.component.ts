import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconButtonComponent} from "../../../lib/buttons/components/icon-button/icon-button.component";
import {ButtonComponent} from "../../../lib/buttons/components/button/button.component";
import {IconDirective} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'ngx-button-preview',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, ButtonComponent, IconDirective],
  templateUrl: './button-preview.component.html',
  styleUrls: ['./button-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonPreviewComponent {

  active = false;

}
