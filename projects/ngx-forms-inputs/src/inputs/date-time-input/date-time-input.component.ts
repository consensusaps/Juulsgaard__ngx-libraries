import {ChangeDetectionStrategy, Component, inject, Injector, LOCALE_ID, ViewChild} from '@angular/core';
import {BaseInputComponent} from "@juulsgaard/ngx-forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Dispose, harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {DayjsDateAdapter, MAT_DAYJS_DATETIME_FORMATS} from "../../adapters/date-adapter";
import {NgxMatTimepickerComponent, NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {MatMenuModule} from "@angular/material/menu";
import {IconButtonComponent} from "@juulsgaard/ngx-material";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DatePickerDialogComponent} from "../../components/date-picker-dialog/date-picker-dialog.component";
import {BehaviorSubject, Subscription} from "rxjs";
import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

@Component({
  selector: 'form-date-time-input',
  standalone: true,
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
  animations: [harmonicaAnimation()],
  imports: [
    AsyncPipe,
    FormsModule,
    IconDirective,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatTooltipModule,
    MatMenuModule,
    IconButtonComponent,
    NoClickBubbleDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATETIME_FORMATS}
  ]
})
export class DateTimeInputComponent extends BaseInputComponent<Date | undefined, Dayjs | undefined> {

  @ViewChild(NgxMatTimepickerComponent, {static: true}) timePicker?: NgxMatTimepickerComponent;
  private injector = inject(Injector);
  private locale = inject(LOCALE_ID);

  timeFormat: 12|24;

  date: Date|null = null;

  textValue$?: BehaviorSubject<string|undefined>;

  constructor(private dialog: MatDialog) {
    super();

    this.timeFormat = new Date(0)
      .toLocaleTimeString(this.locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;

    this.textValue$ = new BehaviorSubject<string|undefined>(this.inputValue?.format('L LT'));
  }

  postprocessValue(value?: Dayjs): Date | undefined {
    return value == undefined ? undefined : value.toDate();
  }

  preprocessValue(value?: Date): Dayjs | undefined {
    const val = value == undefined ? undefined : dayjs.utc(value);
    this.setTextValue(val);
    return val;
  }

  private datePickerRef?: MatDialogRef<DatePickerDialogComponent, Dayjs>;
  @Dispose private datePickerSub?: Subscription;

  openDatePicker() {

    this.datePickerSub?.unsubscribe();
    this.datePickerRef?.close();

    this.datePickerRef = this.dialog.open(DatePickerDialogComponent, {
      injector: this.injector,
      width: '322px',
      data: this.inputValue ?? dayjs().utc(true)
    });

    this.datePickerSub = new Subscription();

    this.datePickerSub.add(this.datePickerRef.beforeClosed().subscribe(date => {
      if (!date) return;

      const current = this.inputValue;

      if (current) {
        date = date.set('hour', current.get('hour'))
          .set('minute', current.get('minute'))
          .set('second', current.get('second'))
          .set('millisecond', current.get('millisecond'));
      }

      this.inputValue = date;
      this.setTextValue(date);

      this.openTimePicker();
    }));

    this.datePickerSub.add(this.datePickerRef.afterClosed().subscribe(val => this.datePickerRef = undefined));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.datePickerRef?.close();
  }

  openTimePicker() {
    if (!this.timePicker) return;
    const date = this.inputValue ?? dayjs.utc('1970-01-01T12:00:00Z');
    this.timePicker.defaultTime = date.format('LT');
    this.timePicker.open();
  }

  pickTime(time: string) {
    const value = dayjs(`1970-01-01 ${time}`).utc(true);
    const current = this.inputValue ?? dayjs.utc();

    const result = current.set('hour', value.get('hour'))
      .set('minute', value.get('minute'))
      .set('second', value.get('second'))
      .set('millisecond', value.get('millisecond'));

    this.inputValue = result;
    this.setTextValue(result);
  }

  setTextValue(value: Dayjs|undefined) {
    this.inputError = undefined;
    this.textValue$?.next(value?.format('L LT'));
  }

  updateTextValue(value: string|undefined) {
    this.textValue$?.next(value);
    const date = value ? dayjs(value).utc(true) : undefined;
    this.inputError = date && !date.isValid() ? 'Invalid Date/Time Format' : undefined;
    this.inputValue = date?.isValid() ? date : undefined;
  }
}
