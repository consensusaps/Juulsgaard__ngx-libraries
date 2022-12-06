import {Component, Host, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {BaseInputComponent, FormScopeService} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation} from "@consensus-labs/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";

@Component({
  selector: 'form-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  animations: [harmonicaAnimation()],
  standalone: true,
  imports: [
    MatLegacyInputModule,
    FormsModule,
    NgIf,
    MatLegacyTooltipModule,
    AsyncPipe
  ],
  providers: []
})
export class NumberInputComponent extends BaseInputComponent<number|undefined, number> {

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value: number | undefined) {
    return value;
  }

  preprocessValue(value: number | undefined): number {
    return value ?? 0;
  }

}
