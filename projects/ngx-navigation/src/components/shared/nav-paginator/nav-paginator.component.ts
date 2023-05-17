import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ListDataSource} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {CommonModule} from "@angular/common";
import {FalsyPipe} from "@consensus-labs/ngx-tools";
import {MatPaginatorModule} from "@angular/material/paginator";

@Component({
  selector: 'ngx-nav-paginator',
  templateUrl: './nav-paginator.component.html',
  styleUrls: ['./nav-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    FalsyPipe
  ]
})
export class NavPaginatorComponent<TModel extends WithId> {

  @Input() dataSource?: ListDataSource<TModel>;

  constructor() { }

}
