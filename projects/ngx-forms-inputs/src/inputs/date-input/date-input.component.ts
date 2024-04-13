import {ChangeDetectionStrategy, Component, inject, Injector, signal, WritableSignal} from '@angular/core';
import dayjs, {Dayjs} from "dayjs";
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {DayjsDateAdapter, MAT_DAYJS_DATE_FORMATS} from "../../adapters/date-adapter";
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormInputErrorsComponent} from "../../components";
import {DayjsHelper} from "../../helpers/dayjs-helper";
import {IconButtonComponent} from "@juulsgaard/ngx-material";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DatePickerDialogComponent} from "../../components/date-picker-dialog/date-picker-dialog.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'form-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDatepickerModule,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatTooltipModule,
    FormInputErrorsComponent,
    NgxInputDirective,
    MatFormField,
    MatLabel,
    MatPrefix,
    IconButtonComponent,
    NoClickBubbleDirective
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATE_FORMATS}
  ]
})
export class DateInputComponent extends BaseInputComponent<Date, Dayjs | undefined> {

  private injector = inject(Injector);
  private dialog = inject(MatDialog);
  private helper = new DayjsHelper();

  constructor() {
    super();

    this._textValue = signal(this.value?.format('L'));
  }

  postprocessValue(value: Dayjs | undefined): Date | undefined {
    return value == undefined ? undefined : value.toDate();
  }

  preprocessValue(value: Date | undefined): Dayjs | undefined {
    const val = value == undefined ? undefined : dayjs.utc(value);
    this.setTextValue(val);
    return val;
  }

  override getInitialValue(): Dayjs | undefined {
    return undefined;
  }

  private readonly _textValue: WritableSignal<string | undefined>;

  get textValue() {
    return this._textValue()
  };

  set textValue(val: string | undefined) {
    this._textValue.set(val);
    const date = val ? this.helper.parseDateStr(val).utc(true) : undefined;
    this.inputError.set(date && !date.isValid() ? 'Invalid Date Format' : undefined);
    this.value = date?.isValid() ? date : undefined;
  }

  private setTextValue(value: Dayjs | undefined) {
    this.inputError.set(undefined)
    this._textValue.set(value?.format('L'));
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
        this.value = date;
        this.setTextValue(date);
      })
    );

    this.datePickerSub.add(
      this.datePickerRef.afterClosed().subscribe(val => this.datePickerRef = undefined)
    );
  }
}
