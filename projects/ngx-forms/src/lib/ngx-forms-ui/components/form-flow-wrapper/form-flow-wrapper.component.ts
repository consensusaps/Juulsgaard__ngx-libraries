import {ChangeDetectionStrategy, Component, input, InputSignal, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'form-flow-wrapper',
  templateUrl: './form-flow-wrapper.component.html',
  styleUrls: ['./form-flow-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.grid-template-columns]': `'repeat(auto-fit, minmax(' + minWidth() + 'px, 1fr))'`
  }
})
export class FormFlowWrapperComponent {

  readonly minWidth: InputSignal<number> = input(200);

  constructor() { }

}
