import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'form-bool-input',
  templateUrl: './bool-input.component.html',
  styleUrls: ['./bool-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    IconDirective,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule
  ],
  standalone: true
})
export class BoolInputComponent extends BaseInputComponent<boolean, boolean> {

  readonly labelPosition: InputSignal<"before" | "after"> = input<'before' | 'after'>('after');

  constructor() {
    super();
  }

  postprocessValue(value: boolean) {
    return value;
  }

  preprocessValue(value: boolean | undefined) {
    return value ?? false;
  }

}
