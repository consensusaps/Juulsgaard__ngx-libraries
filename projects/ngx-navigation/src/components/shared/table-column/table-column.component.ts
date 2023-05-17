import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {RenderDataTypes} from "@consensus-labs/data-sources";
import {applySelector, isString, MapFunc, slugify, titleCase} from "@consensus-labs/ts-tools";
import {MatSortModule} from "@angular/material/sort";
import {
  DatePipe, DecimalPipe, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet
} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatColumnDef, MatTable, MatTableModule} from "@angular/material/table";

@Component({
  selector: 'ngx-table-column',
  templateUrl: './table-column.component.html',
  styleUrls: ['./table-column.component.scss'],
  host: {
    class: 'cdk-visually-hidden',
    '[attr.ariaHidden]': 'true'
  },
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    NgSwitch,
    NgClass,
    NgSwitchCase,
    DatePipe,
    DecimalPipe,
    NgTemplateOutlet,
    NgSwitchDefault,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableColumnComponent<TRow, TData, TContext> implements OnInit, OnDestroy {

  renderTypes = RenderDataTypes;

  @Input() id!: string;
  @Input() title?: string;
  @Input() type?: RenderDataTypes;
  @Input() canSort?: boolean;

  @Input() mapType?: MapFunc<TRow, RenderDataTypes>;
  @Input() mapData?: MapFunc<TRow, TData>;
  @Input() mapContext?: MapFunc<TRow, TContext>;

  @Input() templates?: Map<string, TemplateRef<TContext>>|null;

  @ViewChild(MatColumnDef, {static: true}) columnDef!: MatColumnDef;

  constructor(private table: MatTable<unknown>) {
  }

  ngOnInit(): void {
    if (!this.table || !this.columnDef) return;
    this.table.addColumnDef(this.columnDef);
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.removeColumnDef(this.columnDef);
    }
  }

  getType(row: TRow): string|undefined {
    if (this.type) return this.type;
    if (this.mapType) return applySelector(row, this.mapType);
    return undefined;
  }

  getTypeSlug(row: TRow): string {
    return slugify(this.getType(row) ?? '');
  }

  getData(row: TRow): TData|undefined {
    return this.mapData?.(row);
  }

  getNumberData(row: TRow): number|undefined {
    const data = this.getData(row);
    if (data == undefined) return undefined;
    return Number(data);
  }

  getDateData(row: TRow): Date|string|undefined {
    const data = this.getData(row);
    if (data == undefined) return undefined;
    if (data instanceof Date) return data;
    if (isString(data)) return data;
    return data.toString();
  }

  getStringData(row: TRow): string {
    const data = this.getData(row);
    if (data == undefined) return '';
    if (isString(data)) return data;
    return data.toString();
  }

  getTitle(): string {
    return this.title ?? titleCase(this.id);
  }

  getContext(row: TRow) {
    return this.mapContext?.(row) ?? null;
  }
}
