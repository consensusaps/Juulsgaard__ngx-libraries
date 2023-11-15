import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimeAgoDirective} from "../../../directives";
import {CountdownDirective} from "../../../directives/countdown.directive";

@Component({
  selector: 'ngx-time-directive-preview',
  standalone: true,
  imports: [CommonModule, TimeAgoDirective, CountdownDirective],
  templateUrl: './time-directive-preview.component.html',
  styleUrls: ['./time-directive-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeDirectivePreviewComponent {

  @Input() countdown?: Date;
  @Input() timeAgo?: Date;

}
