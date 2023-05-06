import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BaseInputComponent} from '@consensus-labs/ngx-forms';
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";


@Component({
  selector: 'form-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    AsyncPipe,
    NgClass,
    NgIf,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    NoClickBubbleDirective
  ],
  standalone: true
})
export class PasswordInputComponent extends BaseInputComponent<string | undefined, string> {

  showPassword = false;

  constructor() {
    super();
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
