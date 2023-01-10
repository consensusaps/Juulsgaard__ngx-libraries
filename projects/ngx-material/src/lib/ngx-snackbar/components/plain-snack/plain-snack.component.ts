import {ChangeDetectionStrategy, Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {SnackBarData} from "../../models/snack-bar.model";
import {NgIf} from "@angular/common";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {IconDirective} from "@consensus-labs/ngx-tools";


@Component({
  selector: 'ngx-plain-snack',
  templateUrl: './plain-snack.component.html',
  styleUrls: ['../../styles/snackbar.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatLegacyButtonModule,
    NgIf,
    MatIconModule,
    IconDirective
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlainSnackComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
    private snackRef: MatSnackBarRef<PlainSnackComponent>,
  ) { }

  dismiss() {
    this.snackRef.dismiss();
  }
}
