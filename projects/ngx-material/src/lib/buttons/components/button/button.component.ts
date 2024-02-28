import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseButton} from "../../models/base-button.directive";

@Component({
  selector: 'ngx-button, ngx-raised-button, ngx-bordered-button, ngx-flat-button, a[ngxButton], a[ngxRaisedButton], a[ngxBorderedButton], a[ngxFlatButton]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent extends BaseButton {

}
