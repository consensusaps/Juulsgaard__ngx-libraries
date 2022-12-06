import {Component, Host, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {BaseInputComponent, FormScopeService} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation} from "@consensus-labs/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";

@Component({
  selector: 'form-long-text-input',
  templateUrl: './long-text-input.component.html',
  styleUrls: ['./long-text-input.component.scss'],
  animations: [harmonicaAnimation()],
  standalone: true,
  imports: [
    FormsModule,
    MatLegacyInputModule,
    NgIf,
    MatLegacyTooltipModule,
    AsyncPipe
  ],
  providers: []
})
export class LongTextInputComponent extends BaseInputComponent<string|undefined, string> {

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value: string | undefined) {
    return value ? value : undefined;
  }

  preprocessValue(value: string | undefined): string {
    return value ?? "";
  }

}
