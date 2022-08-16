import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCardComponent {

  @Input() icon?: string;

  constructor() { }

}
