import {ChangeDetectionStrategy, Component, computed, input, InputSignalWithTransform} from '@angular/core';
import {FormValidationContext} from "@juulsgaard/ngx-forms-core";
import {harmonicaInAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {isString} from "@juulsgaard/ts-tools";

@Component({
  selector: 'ngx-form-errors',
  standalone: true,
  imports: [
    NgIf,
    IconDirective
  ],
  templateUrl: './form-errors.component.html',
  styleUrl: './form-errors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [harmonicaInAnimation()]
})
export class FormErrorsComponent {

  errors: InputSignalWithTransform<
    FormValidationContext[] | string[],
    FormValidationContext[] | string[] | undefined
  > = input([], {
    transform: (errors: FormValidationContext[] | string[] | undefined) => {
      if (!errors?.length) return [];
      return errors;
    }
  });

  warnings: InputSignalWithTransform<
    FormValidationContext[] | string[],
    FormValidationContext[] | string[] | undefined
  > = input([], {
    transform: (warnings: FormValidationContext[] | string[] | undefined) => {
      if (!warnings?.length) return [];
      return warnings;
    }
  });

  error = computed(() => {
    const error = this.errors().at(0);
    if (!error) return undefined;
    if (isString(error)) return error;
    return error.data.message;
  });

}
