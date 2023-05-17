import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'ngx-nav-tree-folder-preview',
  templateUrl: './nav-tree-folder-preview.component.html',
  styleUrls: ['./nav-tree-folder-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTreeFolderPreviewComponent {

  @Input() icon = 'fad fa-folder';
  @Input() name!: string;

  constructor() { }

}
