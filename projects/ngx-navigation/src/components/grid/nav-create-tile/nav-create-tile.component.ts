import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CreateAction} from "@consensus-labs/data-sources";
import {FileDropDirective} from "@consensus-labs/ngx-tools";
import {CommonModule} from "@angular/common";
import {MatRippleModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'ngx-nav-create-tile',
  templateUrl: './nav-create-tile.component.html',
  styleUrls: ['./nav-create-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FileDropDirective,
    MatButtonModule,
    MatRippleModule,
    MatIconModule
  ],
  standalone: true
})
export class NavCreateTileComponent {

  @Input() config!: CreateAction;

  constructor() { }

  async onFileDrop(event: DragEvent) {
    const files: FileList|File[] = event.dataTransfer?.files ?? [];
    await this.config.upload(files);
  }
}
