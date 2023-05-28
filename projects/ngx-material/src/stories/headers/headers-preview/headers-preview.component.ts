import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "../../../components/header/header.component";
import {WrapContentDirective} from "../../../directives/wrap-content.directive";
import {NgxNavTabBarModule} from "../../../lib/ngx-tab-bar";
import {underscore} from "@angular-devkit/core/src/utils/strings";

@Component({
  selector: 'ngx-headers-preview',
  standalone: true,
  imports: [CommonModule, HeaderComponent, WrapContentDirective, NgxNavTabBarModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './headers-preview.component.html',
  styleUrls: ['./headers-preview.component.scss']
})
export class HeadersPreviewComponent {

  protected readonly underscore = underscore;

  noop() {

  }
}
