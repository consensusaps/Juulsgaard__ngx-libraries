import {Component, Host, Input, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, ReactiveFormsModule} from '@angular/forms';
import { BaseInputComponent, FormScopeService } from '@consensus-labs/ngx-forms';
import {harmonicaAnimation} from "@consensus-labs/ngx-tools";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgIf} from "@angular/common";

@Component({
  selector: 'form-bool-input',
  templateUrl: './bool-input.component.html',
  styleUrls: ['./bool-input.component.scss'],
  animations: [harmonicaAnimation()],
  imports: [
    MatTooltipModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true
})
export class BoolInputComponent extends BaseInputComponent<boolean, boolean> {

  @Input() labelPosition: 'before'|'after' = 'after';

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value: boolean) {
    return value;
  }

  preprocessValue(value: boolean|undefined) {
    return value ?? false;
  }

}
