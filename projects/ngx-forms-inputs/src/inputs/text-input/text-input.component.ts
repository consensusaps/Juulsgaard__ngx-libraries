import {FormsModule} from "@angular/forms";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {BaseInputComponent} from "@juulsgaard/ngx-forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'form-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    FormsModule,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatTooltipModule
  ],
  standalone: true
})
export class TextInputComponent extends BaseInputComponent<string, string> {

  constructor() {
    super();
  }

  postprocessValue(value: string) {
    return value ? value : undefined;
  }

  preprocessValue(value: string | undefined): string {
    return value ?? '';
  }

}
