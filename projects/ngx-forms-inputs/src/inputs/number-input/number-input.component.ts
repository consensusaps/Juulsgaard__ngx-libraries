import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {BaseInputComponent, FormContext} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'form-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatLegacyInputModule,
    FormsModule,
    NgIf,
    MatLegacyTooltipModule,
    AsyncPipe,
    MatIconModule,
    IconDirective
  ],
  providers: []
})
export class NumberInputComponent extends BaseInputComponent<number | undefined, number> {

  constructor(
    changes: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
    @Optional() formScope: FormContext
  ) {
    super(changes, controlContainer, formScope);
  }

  postprocessValue(value: number | undefined) {
    return value;
  }

  preprocessValue(value: number | undefined): number {
    return value ?? 0;
  }

}
