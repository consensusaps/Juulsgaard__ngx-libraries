import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'form-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatTooltipModule
  ],
  providers: []
})
export class NumberInputComponent extends BaseInputComponent<number | undefined, number|undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: number | undefined) {
    return value;
  }

  preprocessValue(value: number | undefined): number|undefined {
    if (value == null) {
      const control = this.control();
      if (control && !control.nullable) return 0;
      return undefined;
    }

    return value;
  }

}
