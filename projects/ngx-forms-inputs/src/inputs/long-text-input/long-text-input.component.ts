import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormInputErrorsComponent} from "../../components";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
  selector: 'form-long-text-input',
  templateUrl: './long-text-input.component.html',
  styleUrls: ['./long-text-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatFormField,
    MatLabel,
    MatPrefix,
    MatSuffix,
    MatTooltipModule,
    FormInputErrorsComponent,
    NgxInputDirective,
    CdkTextareaAutosize
  ],
  providers: []
})
export class LongTextInputComponent extends BaseInputComponent<string, string|undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: string | undefined): string | undefined {
    return value || undefined;
  }

  preprocessValue(value: string | undefined): string | undefined{
    return value;
  }

}
