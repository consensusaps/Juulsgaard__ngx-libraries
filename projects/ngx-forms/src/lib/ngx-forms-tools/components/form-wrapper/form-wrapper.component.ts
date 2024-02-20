import {
  booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, forwardRef, input, Output
} from '@angular/core';
import {FormContext} from "../../services/form-context.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TruthyPipe} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
  providers: [{provide: FormContext, useExisting: forwardRef(() => FormWrapperComponent)}],
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

  readonly fieldset = input(false, {transform: booleanAttribute});
  readonly readonly = input(false, {transform: booleanAttribute});

  constructor() {
    super();
  }
}
