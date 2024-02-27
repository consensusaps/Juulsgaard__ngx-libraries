import {ChangeDetectionStrategy, Component, input, InputSignal, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCardComponent {

  readonly icon: InputSignal<string | undefined> = input<string>();

  constructor() { }

}
