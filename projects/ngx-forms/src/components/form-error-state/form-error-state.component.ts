import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, input, InputSignal, InputSignalWithTransform, output,
  OutputEmitterRef
} from '@angular/core';
import {FormValidationContext} from "@juulsgaard/ngx-forms-core";
import {IconDirective} from "@juulsgaard/ngx-tools";
import {IconButtonComponent} from "@juulsgaard/ngx-material";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'ngx-form-error-state',
  standalone: true,
  imports: [
    IconDirective,
    IconButtonComponent,
    MatTooltip
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

  tooltip = computed(() => {
    const errors = this.errors();
    const warnings = this.warnings();

    if (errors.length) {
      if (!warnings.length) return `${errors.length} Errors`;
      return `${errors.length} Errors and ${warnings.length} Warnings`;
    }

    if (warnings.length) return `${warnings.length} Warnings`;
    return '';
  });

  readonly button: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly show: InputSignal<boolean> = input<boolean>(false);
  readonly showChange: OutputEmitterRef<boolean> = output<boolean>();

  toggleErrors() {
    this.showChange.emit(!this.show());
  }
}
