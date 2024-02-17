import {booleanAttribute, ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'ngx-list-item, a[ngx-list-item]',
  templateUrl: './ngx-list-item.component.html',
  styleUrls: ['./ngx-list-item.component.scss'],
  host: {'[class.ngx-list-item]': 'true', '[class.active]': 'active()'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxListItemComponent {

  active = input(false, {transform: booleanAttribute});

}
