import {Component, Host, Input, Optional, SkipSelf} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import { BaseInputComponent, FormScopeService } from '@consensus-labs/ngx-forms';
import {FileDropDirective, FileSizePipe} from "@consensus-labs/ngx-tools";
import {NgClass, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'form-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  standalone: true,
  imports: [
    FileDropDirective,
    NgIf,
    MatButtonModule,
    FileSizePipe,
    NgClass
  ],
  providers: []
})
export class FileInputComponent extends BaseInputComponent<File | null, File | null> {

  @Input() accept = '*';

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value: File|null) {
    return value ?? undefined;
  }

  preprocessValue(value: File | undefined) {
    return value ?? null;
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
