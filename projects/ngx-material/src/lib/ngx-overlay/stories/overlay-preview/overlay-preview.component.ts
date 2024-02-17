import {Component, EventEmitter, Input, model, Output} from '@angular/core';
import {NgxOverlayModule} from "../../ngx-overlay.module";
import {MatButtonModule} from "@angular/material/button";
import {NgxOverlayOutletModule} from "../../ngx-overlay-outlet.module";
import {NgIf} from "@angular/common";

@Component({
  selector: 'ngx-overlay-preview',
  standalone: true,
  imports: [
    NgxOverlayModule,
    MatButtonModule,
    NgxOverlayOutletModule,
    NgIf
  ],
  templateUrl: './overlay-preview.component.html',
  styleUrls: ['./overlay-preview.component.css']
})
export class OverlayPreviewComponent {
  show = model(true);
  @Input() scrollable = false;
  @Input() content = 'This is the contents of the Overlay';

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
    this.show.set(false);
  }
}
