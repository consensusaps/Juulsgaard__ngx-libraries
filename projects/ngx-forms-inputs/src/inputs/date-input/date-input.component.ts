import {Component, Host, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import dayjs, {Dayjs} from "dayjs";
import {harmonicaAnimation} from "@consensus-labs/ngx-tools";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {DayjsDateAdapter, MAT_DAYJS_DATE_FORMATS} from "../../adapters/date-adapter";
import {BaseInputComponent, FormScopeService} from '@consensus-labs/ngx-forms';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";

@Component({
  selector: 'form-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  animations: [harmonicaAnimation()],
  standalone: true,
  imports: [
    FormsModule,
    MatLegacyTooltipModule,
    MatLegacyInputModule,
    MatDatepickerModule,
    NgIf,
    AsyncPipe
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
export class DateInputComponent extends BaseInputComponent<Date|undefined, Dayjs|undefined> {

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value?: Dayjs): Date|undefined {
    return value === undefined ? undefined : value.toDate();
  }

  preprocessValue(value?: Date): Dayjs|undefined {
    return value === undefined ? undefined : dayjs(value);
  }

}
