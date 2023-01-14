import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Input, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, ReactiveFormsModule} from '@angular/forms';
import {BaseInputComponent, FormScopeService} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacySlideToggleModule} from "@angular/material/legacy-slide-toggle";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'form-bool-input',
  templateUrl: './bool-input.component.html',
  styleUrls: ['./bool-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatLegacyTooltipModule,
    MatLegacySlideToggleModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    IconDirective
  ],
  standalone: true
})
export class BoolInputComponent extends BaseInputComponent<boolean, boolean> {

  @Input() labelPosition: 'before' | 'after' = 'after';

  constructor(
    changes: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
    @Optional() formScope: FormScopeService
  ) {
    super(changes, controlContainer, formScope);
  }

  postprocessValue(value: boolean) {
    return value;
  }

  preprocessValue(value: boolean | undefined) {
    return value ?? false;
  }

}
