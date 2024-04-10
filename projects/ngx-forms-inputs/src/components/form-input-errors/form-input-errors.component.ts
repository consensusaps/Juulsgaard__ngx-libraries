import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {harmonicaInAnimation} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'ngx-form-input-errors',
  standalone: true,
  imports: [],
  templateUrl: './form-input-errors.component.html',
  styleUrl: './form-input-errors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [harmonicaInAnimation()],
})
export class FormInputErrorsComponent {

  errors = input([] as string[]);
  warnings = input([] as string[]);

}
