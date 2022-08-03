import {Component, Input, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormCardComponent {

  @Input() icon?: string;

  constructor() { }

}
