import {Component, Host, Inject, LOCALE_ID, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {NgxMatTimepickerComponent, NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {harmonicaAnimation, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {BaseInputComponent, FormScopeService} from '@consensus-labs/ngx-forms';
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRippleModule} from "@angular/material/core";

@Component({
  selector: 'form-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  animations: [harmonicaAnimation()],
  imports: [
    MatInputModule,
    NoClickBubbleDirective,
    NgxMatTimepickerModule,
    FormsModule,
    MatTooltipModule,
    MatRippleModule,
    NgIf,
    AsyncPipe
  ],
  standalone: true
})
export class TimeInputComponent extends BaseInputComponent<Date, string | undefined> {

  timeFormat: number;

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService, @Inject(LOCALE_ID) public locale: string) {
    super(controlContainer, formScope);

    this.timeFormat = new Date(0)
      .toLocaleTimeString(locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;
  }

  postprocessValue(value?: string): Date | undefined {
    if (!value) return undefined;
    const date = new Date(`1970-1-1 ${value}`);
    const invalid = isNaN(date.getTime());

    this.inputError = invalid ? 'Invalid Time Format' : undefined;
    if (invalid) return undefined;

    date.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds());
    return date;
  }

  preprocessValue(value?: Date): string | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    date.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit"})
  }

  pickTime(time: string) {
    this.inputValue = time;
  }

  openPicker(picker: NgxMatTimepickerComponent) {
    const date = new Date(this.externalValue ?? '1970-1-1 12:00:00');
    date.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    picker.defaultTime = date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit"});
    picker.open();
  }
}
