import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxNavTabBarModule} from "../../ngx-nav-tab-bar.module";

@Component({
  selector: 'ngx-tab-bar-preview',
  standalone: true,
  imports: [CommonModule, NgxNavTabBarModule],
  templateUrl: './tab-bar-preview.component.html',
  styleUrls: ['./tab-bar-preview.component.css']
})
export class TabBarPreviewComponent {
  @Output() slugChange = new EventEmitter<string|undefined>();

  onChange(slug: string|undefined) {
    console.log(slug);
    this.slugChange.emit(slug)
  }
}
