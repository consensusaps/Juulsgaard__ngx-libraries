import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSideMenuOutletDirective} from "../../directives/side-menu-outlet.directive";
import {NgxSideMenuModule} from "../../ngx-side-menu.module";

@Component({
  selector: 'ngx-side-menu-preview',
  standalone: true,
  imports: [CommonModule, NgxSideMenuModule, NgxSideMenuOutletDirective, NgxSideMenuModule],
  templateUrl: './side-menu-preview.component.html',
  styleUrls: ['./side-menu-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuPreviewComponent {

  @Input() show = false;
  @Output() showChanged = new EventEmitter<boolean|string|undefined>;

}
