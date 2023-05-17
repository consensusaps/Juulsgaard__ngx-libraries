import {Injectable, OnInit} from "@angular/core";
import {WithId} from "@consensus-labs/ts-tools";
import {AnyTreeSelection, TreeFolder, TreeFolderData} from "@consensus-labs/data-sources";
import {Observable, of, OperatorFunction} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {BaseTreeContext} from "../../../models/base-tree-context";

@Injectable()
export abstract class SelectionTreeContext<TFolder extends WithId, TItem extends WithId> extends BaseTreeContext<TFolder, TItem> implements OnInit {

  protected abstract state: AnyTreeSelection<TFolder, TItem>;
  get multiSelect() {return this.state.multiple};


  protected constructor() {
    super();
  }

  ngOnInit() {

    if (!this.dataSource) {
      console.error('Datasource is required for Selection Trees');
      return;
    }

    if (!this.state) {
      console.error('Tree Selection / Range is required for Selection Trees');
      return;
    }
  }

  itemActive$(itemId: string) {
    return this.state.isActive$(itemId);
  }

  folderStatePipe() : OperatorFunction<TreeFolderData<TFolder, TItem>, [checked: Observable<boolean>, indeterminate: Observable<boolean>]> {
    if (!this.state.multiple) {
      return () => of([of(false), of(false)]);
    }

    const state = this.state;

    return folder$ => folder$.pipe(
      map(x => x.model),
      distinctUntilChanged(),
      map(folder => state.getFolderState$(folder)),
      cache()
    );
  }

  toggleFolder(folder: TreeFolder<TFolder, TItem>, checked: boolean) {
    if (!this.state.multiple) return;
    this.state.toggleFolder(folder, checked);
  }

  toggleItem(item: TItem) {
    this.state.toggleItem(item);
  }
}
