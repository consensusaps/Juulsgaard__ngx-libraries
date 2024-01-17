import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {SnackbarBaseComponent} from "../../models/snackbar-base.component";
import {SnackBarData} from "../../models/snack-bar.model";
import {IconButtonComponent} from "../../../../components";

@Component({
  selector: 'ngx-info-snackbar',
  templateUrl: './info-snackbar.component.html',
  styleUrls: ['./info-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    IconButtonComponent
  ]
})
export class InfoSnackbarComponent extends SnackbarBaseComponent<SnackBarData> {
  constructor() {
    super();
  }
}
