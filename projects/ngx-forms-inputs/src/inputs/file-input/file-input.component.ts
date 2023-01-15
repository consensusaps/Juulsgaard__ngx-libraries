import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Input, Optional, SkipSelf} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {BaseInputComponent, FormContext} from '@consensus-labs/ngx-forms';
import {FileDropDirective, FileSizePipe, IconDirective} from "@consensus-labs/ngx-tools";
import {NgClass, NgIf} from "@angular/common";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'form-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FileDropDirective,
    NgIf,
    MatLegacyButtonModule,
    FileSizePipe,
    NgClass,
    MatIconModule,
    FileDropDirective,
    FileSizePipe,
    IconDirective
  ],
  providers: []
})
export class FileInputComponent extends BaseInputComponent<File | undefined, File | undefined> {

  @Input() accept = '*';

  constructor(
    changes: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
    @Optional() formScope: FormContext
  ) {
    super(changes, controlContainer, formScope);
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
