import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxListModule} from "../../ngx-list.module";
import {IconDirective} from "@consensus-labs/ngx-tools";
import {MatDividerModule} from "@angular/material/divider";
import {NgxDividerComponent} from "../../../../components/divider/ngx-divider.component";

@Component({
  selector: 'ngx-list-preview',
  standalone: true,
  imports: [CommonModule, NgxListModule, IconDirective, MatDividerModule, NgxDividerComponent],
  templateUrl: './ngx-list-preview.component.html',
  styleUrls: ['./ngx-list-preview.component.css']
})
export class NgxListPreviewComponent {

}
