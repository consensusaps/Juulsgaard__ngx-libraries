import {Directive, Input, TemplateRef} from "@angular/core";
import {WithId} from "@juulsgaard/ts-tools";
import {TreeDataSource} from "@juulsgaard/data-sources";

@Directive({selector: '[treeItemTemplate]', standalone: true})
export class TreeItemTemplateDirective<TItem extends WithId> {

  @Input('treeItemTemplate') id!: string;
  @Input('type') dataSource?: TreeDataSource<any, TItem>;

  constructor(public readonly template: TemplateRef<TreeItemTemplateContext<TItem>>) {
  }
}

export interface TreeItemTemplateContext<T> {
  folder: T;
  val: any;
}
