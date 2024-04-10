import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {BaseMultiSelectInputComponent} from "@juulsgaard/ngx-forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {FormInputErrorsComponent} from "../../components";

@Component({
  selector: 'form-mat-select-multiple',
  templateUrl: './mat-select-multiple-input.component.html',
  styleUrls: ['./mat-select-multiple-input.component.scss'],
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
export class MatSelectMultipleInputComponent<TValue, TItem>
  extends BaseMultiSelectInputComponent<TValue, TItem, TValue[]> {

  constructor() {
    super();
  }

  postprocessValue(value: TValue[]): TValue[]|undefined {
    return value.length ?  value : undefined;
  }

  preprocessValue(value: TValue[]|undefined): TValue[] {
    return value ?? [];
  }

}
