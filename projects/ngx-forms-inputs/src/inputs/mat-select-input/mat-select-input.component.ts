import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {BaseSingleSelectInputComponent} from "@juulsgaard/ngx-forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {FormInputErrorsComponent} from "../../components";

@Component({
  selector: 'form-mat-select',
  templateUrl: './mat-select-input.component.html',
  styleUrls: ['./mat-select-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    AsyncPipe,
    NgIf,
    NgForOf,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    FormInputErrorsComponent
  ],
  standalone: true
})
export class MatSelectInputComponent<TValue, TItem>
  extends BaseSingleSelectInputComponent<TValue, TItem, TValue | undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: TValue | undefined): TValue | undefined {
    return value;
  }

  preprocessValue(value: TValue | undefined): TValue | undefined {
    return value;
  }

  onOpenStatus(opened: boolean) {
    if (opened) return;
    this.markAsTouched();
  }
}
