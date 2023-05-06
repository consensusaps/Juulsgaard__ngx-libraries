import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BaseInputComponent} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from '@consensus-labs/ngx-tools';
import {ColorPickerModule} from "ngx-color-picker";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'form-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColorPickerModule,
    NoClickBubbleDirective,
    FormsModule,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatTooltipModule
  ],
  standalone: true
})
export class ColorInputComponent extends BaseInputComponent<string | undefined, string> {

  @Input() noAlpha = false;

  constructor() {
    super();
  }

  postprocessValue(value?: string) {
    if (!value) return undefined;
    value = value.trim();

    if (value.search(/^#[\da-f]{6}$/i) >= 0) {
      return value.toUpperCase();
    }

    const alphaMatch = value.match(/^(#[\da-f]{6})[\da-f]{2}$/i);

    if (alphaMatch) {
      return this.noAlpha ? alphaMatch[1]?.toUpperCase() : alphaMatch[0]?.toUpperCase();
    }

    return value;
  }

  preprocessValue(value?: string): string {
    return value?.trim() ?? '';
  }

}
