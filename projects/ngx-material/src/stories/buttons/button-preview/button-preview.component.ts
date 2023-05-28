import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconButtonComponent} from "../../../components/icon-button/icon-button.component";

@Component({
  selector: 'ngx-button-preview',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  templateUrl: './button-preview.component.html',
  styleUrls: ['./button-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonPreviewComponent {

  active = false;

}
