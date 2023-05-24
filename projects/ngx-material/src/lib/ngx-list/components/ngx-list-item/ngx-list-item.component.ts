import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'ngx-list-item, a[ngx-list-item]',
  templateUrl: './ngx-list-item.component.html',
  styleUrls: ['./ngx-list-item.component.scss'],
  host: {'[class.ngx-list-item]': 'true'},
})
export class NgxListItemComponent {

  @HostBinding('class.active')
  @Input() active?: boolean;

}
