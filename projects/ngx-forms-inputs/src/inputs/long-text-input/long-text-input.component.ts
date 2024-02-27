import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'form-long-text-input',
  templateUrl: './long-text-input.component.html',
  styleUrls: ['./long-text-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatTooltipModule
  ],
  providers: []
})
export class LongTextInputComponent extends BaseInputComponent<string, string> {

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
