import {
  booleanAttribute, ChangeDetectionStrategy, Component, input, InputSignal, InputSignalWithTransform
} from '@angular/core';
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

  canShow: InputSignalWithTransform<boolean, unknown> = input(true, {transform: booleanAttribute});

  errors: InputSignal<string[]> = input([] as string[]);
  warnings: InputSignal<string[]> = input([] as string[]);

}
