import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgxOverlayModule} from "../../ngx-overlay.module";
import {MatButtonModule} from "@angular/material/button";
import {OverlayOutletDirective} from "../../directives/overlay-outlet.directive";

@Component({
  selector: 'ngx-overlay-preview',
  standalone: true,
  imports: [
    NgxOverlayModule,
    MatButtonModule,
    OverlayOutletDirective
  ],
  templateUrl: './overlay-preview.component.html',
  styleUrls: ['./overlay-preview.component.css']
})
export class OverlayPreviewComponent {
  @Input() show = true;
  @Input() scrollable = false;
  @Input() content = 'This is the contents of the Overlay';
  @Input() maxWidth?: number;

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
    this.show = false;
  }
}
