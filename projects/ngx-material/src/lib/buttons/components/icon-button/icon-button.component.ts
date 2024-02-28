import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IconDirective} from "@juulsgaard/ngx-tools";
import {BaseIconButton} from "../../models/base-icon-button.directive";

@Component({
  selector: 'ngx-icon-button, ngx-raised-icon-button, ngx-bordered-icon-button, ngx-flat-icon-button, a[ngxIconButton], a[ngxRaisedIconButton], a[ngxBorderedIconButton], a[ngxFlatIconButton]',
  standalone: true,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  imports: [
    IconDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent extends BaseIconButton {

}

