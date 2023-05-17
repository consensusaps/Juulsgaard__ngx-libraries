import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TreeItemData} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {SelectionTreeContext} from "../../models/selection-tree-context";

@Component({
  selector: 'app-selection-tree-item',
  templateUrl: './selection-tree-item.component.html',
  styleUrls: ['./selection-tree-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// TODO: Rewrite to OnPush
export class SelectionTreeItemComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  @Input() item!: TreeItemData<TFolder, TItem>;

  active$?: Observable<boolean>;

  constructor(public context: SelectionTreeContext<TFolder, TItem>) { }

  ngOnInit() {
    this.active$ = this.context.itemActive$(this.item.model.model.id);
  }

}
