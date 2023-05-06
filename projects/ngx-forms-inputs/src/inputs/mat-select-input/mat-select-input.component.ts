import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {BaseSelectInputComponent} from "@consensus-labs/ngx-forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";

type ArrOrNullable<T> = T extends any[] ? T : T | undefined;

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
    MatSelectModule
  ],
  standalone: true
})
export class MatSelectInputComponent<TItem, TVal extends any | any[]> extends BaseSelectInputComponent<ArrOrNullable<TVal>, ArrOrNullable<TVal>, TItem> {

  get canClear() {
    return (
      this.multiple || !this.required
    ) && this.clearable;
  }

  trackBy = (index: number, item: TItem) => this.getValue(item);

  constructor() {
    super();
  }

  postprocessValue(value: ArrOrNullable<TVal>) {
    if (!value) return this.multiple ? [] as TVal : undefined;
    if (this.multiple) {
      return Array.isArray(value) ? value : [value] as TVal;
    }
    return Array.isArray(value) ? value[0] : value;
  }

  preprocessValue(value: ArrOrNullable<TVal> | undefined) {
    if (!value) return this.multiple ? [] as TVal : undefined;
    if (this.multiple) {
      return Array.isArray(value) ? value : [value] as TVal;
    }
    return Array.isArray(value) ? value[0] : value;
  }

}
