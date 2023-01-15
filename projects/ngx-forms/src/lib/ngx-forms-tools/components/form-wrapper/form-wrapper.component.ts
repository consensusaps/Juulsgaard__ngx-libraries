import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormContext} from "../../services/form-context.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TruthyPipe} from "@consensus-labs/ngx-tools";

@Component({
  selector: 'form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
  providers: [{provide: FormContext, useExisting: FormWrapperComponent}],
  imports: [
    CommonModule,
    FormsModule,
    TruthyPipe
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormWrapperComponent extends FormContext {

  @Output() submit = new EventEmitter<void>();
  @Input() fieldset = false;

  @Input('readonly') set readonlyState(readonly: boolean) {
    this._readonly$.next(readonly);
  }

  constructor() {
    super();
  }
}
