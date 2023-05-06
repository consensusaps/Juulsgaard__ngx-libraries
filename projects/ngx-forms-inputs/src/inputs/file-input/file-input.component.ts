import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BaseInputComponent} from '@consensus-labs/ngx-forms';
import {FileDropDirective, FileSizePipe, IconDirective} from "@consensus-labs/ngx-tools";
import {NgClass, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'form-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FileDropDirective,
    NgIf,
    FileSizePipe,
    NgClass,
    MatIconModule,
    FileDropDirective,
    FileSizePipe,
    IconDirective,
    MatButtonModule
  ],
  providers: []
})
export class FileInputComponent extends BaseInputComponent<File | undefined, File | undefined> {

  @Input() accept = '*';

  constructor() {
    super();
  }

  preprocessValue(value: File | undefined) {
    return value;
  }

  postprocessValue(value: File | undefined) {
    return value ?? undefined;
  }

  dropFile(event: DragEvent) {
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.inputValue = file;
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.inputValue = file;
    input.value = '';
  }

}
