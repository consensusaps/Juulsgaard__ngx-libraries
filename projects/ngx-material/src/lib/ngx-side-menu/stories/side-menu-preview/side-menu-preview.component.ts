import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSideMenuModule} from "../../ngx-side-menu.module";
import {NgxSideMenuOutletModule} from "../../ngx-side-menu-outlet.module";

@Component({
  selector: 'ngx-side-menu-preview',
  standalone: true,
  imports: [
    CommonModule, NgxSideMenuModule, NgxSideMenuModule, NgxSideMenuModule, NgxSideMenuOutletModule
  ],
  templateUrl: './side-menu-preview.component.html',
  styleUrls: ['./side-menu-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuPreviewComponent {

  @Input() slug?: string;
  @Output() slugChanged = new EventEmitter<string|undefined>;

  @Input() show = false;
  @Output() showChanged = new EventEmitter<boolean|string|undefined>;

}
