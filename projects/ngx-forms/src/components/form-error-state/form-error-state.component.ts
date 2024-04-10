import {
  booleanAttribute, ChangeDetectionStrategy, Component, input, InputSignal, InputSignalWithTransform, output,
  OutputEmitterRef
} from '@angular/core';
import {FormValidationContext} from "@juulsgaard/ngx-forms-core";
import {IconDirective} from "@juulsgaard/ngx-tools";
import {IconButtonComponent} from "@juulsgaard/ngx-material";

@Component({
  selector: 'ngx-form-error-state',
  standalone: true,
  imports: [
    IconDirective,
    IconButtonComponent
  ],
  templateUrl: './form-error-state.component.html',
  styleUrl: './form-error-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormErrorStateComponent {

  readonly errors: InputSignalWithTransform<
    FormValidationContext[] | string[],
    FormValidationContext[] | string[] | undefined
  > = input([], {
    transform: (errors: FormValidationContext[] | string[] | undefined) => {
      if (!errors?.length) return [];
      return errors;
    }
  });

  readonly warnings: InputSignalWithTransform<
    FormValidationContext[] | string[],
    FormValidationContext[] | string[] | undefined
  > = input([], {
    transform: (warnings: FormValidationContext[] | string[] | undefined) => {
      if (!warnings?.length) return [];
      return warnings;
    }
  });

  readonly button: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly show: InputSignal<boolean> = input<boolean>(false);
  readonly showChange: OutputEmitterRef<boolean> = output<boolean>();

  toggleErrors() {
    this.showChange.emit(!this.show());
  }
}
