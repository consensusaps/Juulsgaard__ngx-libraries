import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'form-flow-wrapper',
  templateUrl: './form-flow-wrapper.component.html',
  styleUrls: ['./form-flow-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.grid-template-columns]': `'repeat(auto-fit, minmax(' + minWidth + 'px, 1fr))'`
  }
})
export class FormFlowWrapperComponent {

  @Input() minWidth = 200;

  constructor() { }

}
