import {Directive, Input, TemplateRef} from "@angular/core";
import {WithId} from "@consensus-labs/ts-tools";
import {TreeDataSource} from "@consensus-labs/data-sources";

@Directive({selector: '[treeFolderTemplate]', standalone: true})
export class TreeFolderTemplateDirective<TFolder extends WithId> {

  @Input('treeFolderTemplate') id!: string;
  @Input('type') dataSource?: TreeDataSource<TFolder, any>;

  constructor(public readonly template: TemplateRef<TreeFolderTemplateContext<TFolder>>) {
  }
}

export interface TreeFolderTemplateContext<T> {
  folder: T;
  val: any;
}
