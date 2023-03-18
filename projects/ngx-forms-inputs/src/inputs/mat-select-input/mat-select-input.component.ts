import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {BaseSelectInputComponent} from "@consensus-labs/ngx-forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacySelectModule} from "@angular/material/legacy-select";
import {MatIconModule} from "@angular/material/icon";

type ArrOrNullable<T> = T extends any[] ? T : T | undefined;

@Component({
  selector: 'form-mat-select',
  templateUrl: './mat-select-input.component.html',
  styleUrls: ['./mat-select-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatLegacySelectModule,
    AsyncPipe,
    NgIf,
    MatLegacyTooltipModule,
    NgForOf,
    MatIconModule,
    IconDirective
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
