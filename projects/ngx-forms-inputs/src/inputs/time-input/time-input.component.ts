import {ChangeDetectionStrategy, Component, inject, LOCALE_ID} from '@angular/core';
import {NgxMatTimepickerComponent, NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {IconButtonComponent} from "@juulsgaard/ngx-material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {FormInputErrorsComponent} from "../../components";

dayjs.extend(utc);

@Component({
  selector: 'form-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NoClickBubbleDirective,
    NgxMatTimepickerModule,
    MatFormField,
    MatLabel,
    MatPrefix,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatTooltipModule,
    MatButtonModule,
    IconButtonComponent,
    FormInputErrorsComponent,
  ],
  standalone: true
})
export class TimeInputComponent extends BaseInputComponent<Date, string | undefined> {

  timeFormat: 12|24;
  locale = inject(LOCALE_ID);

  constructor() {
    super();

    this.timeFormat = new Date(0)
      .toLocaleTimeString(this.locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;
  }

  preprocessValue(value: Date | undefined): string | undefined {
    if (!value) return undefined;
    const date = new Date(value)
    return date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit", timeZone: 'utc'})
  }

  postprocessValue(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    const date = dayjs(`1970-01-01 ${value}`).utc(true)

    this.inputError.set(!date.isValid() ? 'Invalid Time Format' : undefined);
    if (!date.isValid()) return undefined;
    return date.toDate();
  }

  pickTime(time: string) {
    this.value = time;
  }

  openPicker(picker: NgxMatTimepickerComponent) {
    const externalValue = this.externalValue();
    const date = externalValue ? new Date(externalValue) : new Date('1970-01-01T12:00:00Z');
    picker.defaultTime = date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit", timeZone: 'utc'});
    picker.open();
  }
}
