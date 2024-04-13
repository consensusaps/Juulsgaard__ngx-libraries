import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormInputErrorsComponent} from "../../components";

@Component({
  selector: 'form-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatPrefix,
    MatSuffix,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatTooltipModule,
    FormInputErrorsComponent,
    NgxInputDirective
  ],
  providers: []
})
export class NumberInputComponent extends BaseInputComponent<number, string|undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: string | undefined) {
    if (!value) return undefined;
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }

  preprocessValue(value: number | undefined): string|undefined {
    return value?.toString();
  }

}
