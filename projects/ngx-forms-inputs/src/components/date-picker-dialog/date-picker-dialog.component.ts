import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Dayjs} from "dayjs";

@Component({
  selector: 'ngx-date-picker-dialog',
  standalone: true,
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerDialogComponent {

  date: Dayjs|null = null;

  readonly dialogRef = inject(MatDialogRef<DatePickerDialogComponent>)
  readonly data: Dayjs|undefined = inject(MAT_DIALOG_DATA);

  constructor() {
    this.date = this.data ?? null;
  }

  select() {
    if (!this.date) return;
    this.dialogRef.close(this.date);
  }
}
