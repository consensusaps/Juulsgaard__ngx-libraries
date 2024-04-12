import {ChangeDetectionStrategy, Component} from '@angular/core';
import {autoDisable, Form, formPage, Validators} from "@juulsgaard/ngx-forms-core";
import {
  FormHeaderComponent, FormSubmitComponent, FormWrapperComponent, NgxFormsDirectivesModule, NgxFormsUiModule
} from "@juulsgaard/ngx-forms";
import {
  BoolInputComponent, DateInputComponent, DateTimeInputComponent, NumberInputComponent, TextInputComponent,
  TimeInputComponent
} from "../../../inputs";

@Component({
  selector: 'ngx-form-preview',
  standalone: true,
  imports: [
    FormHeaderComponent,
    FormWrapperComponent,
    NgxFormsDirectivesModule,
    TextInputComponent,
    BoolInputComponent,
    NgxFormsUiModule,
    DateInputComponent,
    TimeInputComponent,
    FormSubmitComponent,
    DateTimeInputComponent,
    NumberInputComponent
  ],
  templateUrl: './form-preview.component.html',
  styleUrl: './form-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPreviewComponent {

  form = formPage.create<FormValue>().withForm({
    bool: Form.bool(true).withLabel('Enable Text Input'),
    str: Form.text().withLabel('Text Input').required().withErrors(Validators.minLength(2)).withWarnings(Validators.maxLength(10, 'Avoid making the text too long')),
    layer: Form.layer<LayerValue>({
      date: Form.nullable.date().withLabel('Start Date'),
      time: Form.nullable.time().withLabel('Start Time')
    }).withErrors(this.validate),
    dateTime: Form.datetime().required().withLabel('End Date and Time'),
    number: Form.number().withLabel('Max participants').withErrors(Validators.min(1), Validators.max(1000)),
  })
    .withSubmit(x => console.log(x))
    .done();

  constructor() {
    autoDisable(this.form, disable => disable.str(state => !state.bool()));

  }

  *validate(layer: LayerValue): Generator<string> {
    if (layer.date && layer.time) return;
    if (!layer.date && !layer.time) return;
    yield 'Both date and time need to be set';
  }

}

export interface FormValue {
  bool: boolean;
  str: string;
  dateTime: Date;
  number: number;
  layer: LayerValue;
}

interface LayerValue {
  date?: Date;
  time?: Date;
}
