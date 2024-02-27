import {Component, EventEmitter, Input, model, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {NgxDialogOutletModule} from "../../ngx-dialog-outlet.module";
import {NgxDialogModule} from "../../ngx-dialog.module";

@Component({
  selector: 'ngx-dialog-preview',
  templateUrl: './dialog-preview.component.html',
  styleUrls: ['./dialog-preview.component.css'],
  imports: [
    NgxDialogModule,
    MatButtonModule,
    NgIf,
    NgxDialogOutletModule
  ],
  standalone: true
})
export class DialogPreviewComponent {
  show = model(true);
  showDirective = model(false);
  @Input() header = 'Header';
  @Input() text = 'Content';
  @Input() canClose = true;
  @Output() submit = new EventEmitter<void>();

  close() {
    this.show.set(false);
    this.showDirective.set(false);
  }
}
