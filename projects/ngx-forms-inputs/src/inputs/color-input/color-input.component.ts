import {Component, Host, Input, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {BaseInputComponent, FormScopeService} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation, NoClickBubbleDirective} from '@consensus-labs/ngx-tools';
import {ColorPickerModule} from "ngx-color-picker";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'form-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
  animations: [harmonicaAnimation()],
  imports: [
    MatLegacyTooltipModule,
    MatLegacyInputModule,
    ColorPickerModule,
    NoClickBubbleDirective,
    FormsModule,
    NgIf,
    AsyncPipe,
    MatIconModule
  ],
  standalone: true
})
export class ColorInputComponent extends BaseInputComponent<string|undefined, string> {

  @Input() noAlpha = false;

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value?: string) {
    if (!value) return undefined;
    value = value.trim();

    if (value.search(/^#[\da-f]{6}$/i) >= 0) {
      return value.toUpperCase();
    }

    const alphaMatch = value.match(/^(#[\da-f]{6})[\da-f]{2}$/i);

    if (alphaMatch) {
      return this.noAlpha ? alphaMatch[1].toUpperCase() : alphaMatch[0].toUpperCase();
    }

    return value;
  }

  preprocessValue(value?: string): string {
    return value?.trim() ?? '';
  }

}
