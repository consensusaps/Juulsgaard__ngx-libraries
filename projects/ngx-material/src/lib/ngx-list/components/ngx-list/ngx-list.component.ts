import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'ngx-list',
  templateUrl: './ngx-list.component.html',
  styleUrls: ['./ngx-list.component.scss'],
  host: {'[class.ngx-list]': 'true'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxListComponent {

}
