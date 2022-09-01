import {Component, Host, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import { BaseInputComponent, FormScopeService } from '@consensus-labs/ngx-forms';
import {harmonicaAnimation} from "@consensus-labs/ngx-tools";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";


@Component({
  selector: 'form-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  animations: [harmonicaAnimation()],
  imports: [
    MatInputModule,
    MatTooltipModule,
    FormsModule,
    AsyncPipe,
    MatButtonModule,
    MatRippleModule,
    NgClass,
    NgIf
  ],
  standalone: true
})
export class PasswordInputComponent extends BaseInputComponent<string, string> {

  showPassword = false;

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  toggleShow(event: MouseEvent) {
    this.showPassword = !this.showPassword;
    this.inputElement?.nativeElement?.focus();
  }

  postprocessValue(value?: string) {
    return value ? value : undefined;
  }

  preprocessValue(value?: string): string {
    return value ?? '';
  }
}
