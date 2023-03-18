import {FormsModule} from "@angular/forms";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {BaseInputComponent} from "@consensus-labs/ngx-forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'form-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatLegacyInputModule,
    NgIf,
    MatLegacyTooltipModule,
    AsyncPipe,
    FormsModule,
    MatIconModule,
    IconDirective
  ],
  standalone: true
})
export class TextInputComponent extends BaseInputComponent<string | undefined, string> {

  constructor() {
    super();
  }

  postprocessValue(value: string | undefined) {
    return value ? value : undefined;
  }

  preprocessValue(value: string | undefined): string {
    return value ?? "";
  }

}
