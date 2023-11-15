import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxDragModule} from "../../ngx-drag.module";
import {NgxDragEvent} from "../../models/ngx-drag-event";

@Component({
  selector: 'ngx-ngx-drag-preview',
  standalone: true,
  imports: [CommonModule, NgxDragModule],
  templateUrl: './ngx-drag-preview.component.html',
  styleUrls: ['./ngx-drag-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxDragPreviewComponent {
  source = ['One', 'Two', 'Three'];
  destination: string[] = [];


  onDrop(event: NgxDragEvent<string>) {
    console.log(event);
    const index = this.source.findIndex(x => x === event.data);
    if (index < 0) return;
    this.destination.push(...this.source.splice(index, 1));
  }
}
