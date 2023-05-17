import {Directive, Input, TemplateRef} from "@angular/core";
import {WithId} from "@consensus-labs/ts-tools";
import {ListDataSource} from "@consensus-labs/data-sources";

@Directive({selector: '[tableTemplate]', standalone: true})
export class TableTemplateDirective<T extends WithId> {

  @Input('tableTemplate') id!: string;
  @Input('type') dataSource?: ListDataSource<T>;

  constructor(public readonly template: TemplateRef<TableTemplateContext<T>>) {
  }
}

export interface TableTemplateContext<T> {
  row: T;
  val: any;
}

