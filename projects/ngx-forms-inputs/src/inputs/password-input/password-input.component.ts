import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {IconButtonComponent} from "@juulsgaard/ngx-material";


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
    NoClickBubbleDirective,
    IconButtonComponent
  ],
  standalone: true
})
export class PasswordInputComponent extends BaseInputComponent<string, string> {

  readonly showPassword = signal(false);

  constructor() {
    super();
  }

  toggleShow(event: MouseEvent) {
    this.showPassword.update(x => !x);
    this.inputElement()?.focus();
  }

  preprocessValue(value: string | undefined): string {
    return value ?? '';
  }

  postprocessValue(value: string) {
    return value ? value : undefined;
  }
}
