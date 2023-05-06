import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';


@Component({
  selector: 'ngx-plain-snack',
  templateUrl: './plain-snack.component.html',
  styleUrls: ['../../styles/snackbar.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlainSnackComponent {

  data = inject(MAT_SNACK_BAR_DATA);

  constructor(
    private snackRef: MatSnackBarRef<PlainSnackComponent>,
  ) { }

  dismiss() {
    this.snackRef.dismiss();
  }
}
