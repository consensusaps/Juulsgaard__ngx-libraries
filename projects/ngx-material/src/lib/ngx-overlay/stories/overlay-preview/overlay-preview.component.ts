import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgxOverlayModule} from "../../ngx-overlay.module";
import {MatButtonModule} from "@angular/material/button";
import {NgxOverlayOutletModule} from "../../ngx-overlay-outlet.module";

@Component({
  selector: 'ngx-overlay-preview',
  standalone: true,
  imports: [
    NgxOverlayModule,
    MatButtonModule,
    NgxOverlayOutletModule
  ],
  templateUrl: './overlay-preview.component.html',
  styleUrls: ['./overlay-preview.component.css']
})
export class OverlayPreviewComponent {
  @Input() show = true;
  @Input() scrollable = false;
  @Input() content = 'This is the contents of the Overlay';

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
    this.show = false;
  }
}
