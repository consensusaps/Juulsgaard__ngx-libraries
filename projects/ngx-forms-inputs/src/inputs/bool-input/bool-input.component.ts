import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BaseInputComponent} from '@consensus-labs/ngx-forms';
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

  postprocessValue(value: boolean) {
    return value;
  }

  preprocessValue(value: boolean | undefined) {
    return value ?? false;
  }

}
