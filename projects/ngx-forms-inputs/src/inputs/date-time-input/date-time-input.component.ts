import {
  ChangeDetectionStrategy, Component, inject, Injector, LOCALE_ID, OnDestroy, signal, viewChild, WritableSignal
} from '@angular/core';
import {BaseInputComponent} from "@juulsgaard/ngx-forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
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
import {Subscription} from "rxjs";
import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";
import {DayjsHelper} from "../../helpers/dayjs-helper";

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
export class DateTimeInputComponent extends BaseInputComponent<Date | undefined, Dayjs | undefined> implements OnDestroy {

  private injector = inject(Injector);
  private locale = inject(LOCALE_ID);
  private helper = new DayjsHelper();

  timePicker = viewChild.required(NgxMatTimepickerComponent);

  timeFormat: 12 | 24;

  constructor(private dialog: MatDialog) {
    super();

    this.timeFormat = new Date(0)
      .toLocaleTimeString(this.locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;

    this._textValue = signal(this.value?.format('L LT'));
  }

  postprocessValue(value: Dayjs | undefined): Date | undefined {
    return value == undefined ? undefined : value.toDate();
  }

  preprocessValue(value: Date | undefined): Dayjs | undefined {
    const val = value == undefined ? undefined : dayjs.utc(value);
    this.setTextValue(val);
    return val;
  }

  private datePickerRef?: MatDialogRef<DatePickerDialogComponent, Dayjs>;
  private datePickerSub?: Subscription;

  openDatePicker() {

    this.datePickerSub?.unsubscribe();
    this.datePickerRef?.close();

    this.datePickerRef = this.dialog.open(DatePickerDialogComponent, {
      injector: this.injector,
      width: '322px',
      data: this.value ?? dayjs().utc(true)
    });

    this.datePickerSub = new Subscription();

    this.datePickerSub.add(
      this.datePickerRef.beforeClosed().subscribe(date => {
        if (!date) return;

        const current = this.value;

        if (current) {
          date = date.set('hour', current.get('hour'))
            .set('minute', current.get('minute'))
            .set('second', current.get('second'))
            .set('millisecond', current.get('millisecond'));
        }

        this.value = date;
        this.setTextValue(date);

        this.openTimePicker();
      })
    );

    this.datePickerSub.add(
      this.datePickerRef.afterClosed().subscribe(val => this.datePickerRef = undefined)
    );
  }

  ngOnDestroy() {
    this.datePickerSub?.unsubscribe();
    this.datePickerRef?.close();
  }

  openTimePicker() {
    const picker = this.timePicker();
    if (!picker) return;

    const date = this.value ?? dayjs.utc('1970-01-01T12:00:00Z');
    picker.defaultTime = date.format('LT');
    picker.open();
  }

  pickTime(time: string) {
    const value = dayjs(`1970-01-01 ${time}`).utc(true);
    const current = this.value ?? dayjs.utc();

    const result = current.set('hour', value.get('hour'))
      .set('minute', value.get('minute'))
      .set('second', value.get('second'))
      .set('millisecond', value.get('millisecond'));

    this.value = result;
    this.setTextValue(result);
  }

  private readonly _textValue: WritableSignal<string | undefined>;
  get textValue() {
    return this._textValue()
  };

  set textValue(val: string | undefined) {
    this._textValue.set(val);
    const date = val ? this.helper.parseDateTimeStr(val).utc(true) : undefined;
    this.inputError.set(date && !date.isValid() ? 'Invalid Date/Time Format' : undefined);
    this.value = date?.isValid() ? date : undefined;
  }

  private setTextValue(value: Dayjs | undefined) {
    this.inputError.set(undefined)
    this._textValue.set(value?.format('L LT'));
  }
}
