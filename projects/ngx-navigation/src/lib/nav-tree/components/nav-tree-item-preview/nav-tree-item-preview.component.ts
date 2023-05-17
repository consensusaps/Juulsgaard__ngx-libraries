import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'ngx-nav-tree-item-preview',
  templateUrl: './nav-tree-item-preview.component.html',
  styleUrls: ['./nav-tree-item-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTreeItemPreviewComponent {

  @Input() icon!: string;
  @Input() name!: string;

  constructor() { }

}
