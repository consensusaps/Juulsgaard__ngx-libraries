import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgxDialogModule} from "../../ngx-dialog.module";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {DialogOutletDirective} from "../../directives/dialog-outlet.directive";

@Component({
  selector: 'ngx-dialog-preview',
  templateUrl: './dialog-preview.component.html',
  styleUrls: ['./dialog-preview.component.css'],
  imports: [
    NgxDialogModule,
    MatButtonModule,
    NgIf,
    DialogOutletDirective
  ],
  standalone: true
})
export class DialogPreviewComponent {
  @Input() show = true;
  @Input() header = 'Header';
  @Input() text = 'Content';
  @Output() submit = new EventEmitter<void>();
}
