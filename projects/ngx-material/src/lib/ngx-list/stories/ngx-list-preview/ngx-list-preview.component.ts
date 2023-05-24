import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxListModule} from "../../ngx-list.module";
import {IconDirective} from "@consensus-labs/ngx-tools";

@Component({
  selector: 'ngx-list-preview',
  standalone: true,
  imports: [CommonModule, NgxListModule, IconDirective],
  templateUrl: './ngx-list-preview.component.html',
  styleUrls: ['./ngx-list-preview.component.css']
})
export class NgxListPreviewComponent {

}
