import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {BaseInputComponent, FormScopeService} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {MatLegacyRippleModule} from "@angular/material/legacy-core";
import {MatIconModule} from "@angular/material/icon";


@Component({
  selector: 'form-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatLegacyInputModule,
    MatLegacyTooltipModule,
    FormsModule,
    AsyncPipe,
    MatLegacyButtonModule,
    MatLegacyRippleModule,
    NgClass,
    NgIf,
    MatIconModule,
    IconDirective
  ],
  standalone: true
})
export class PasswordInputComponent extends BaseInputComponent<string | undefined, string> {

  showPassword = false;

  constructor(
    changes: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
    @Optional() formScope: FormScopeService
  ) {
    super(changes, controlContainer, formScope);
  }

  toggleShow(event: MouseEvent) {
    this.showPassword = !this.showPassword;
    this.inputElement?.nativeElement?.focus();
  }

  preprocessValue(value: string | undefined): string {
    return value ?? '';
  }

  postprocessValue(value: string | undefined) {
    return value ? value : undefined;
  }
}
