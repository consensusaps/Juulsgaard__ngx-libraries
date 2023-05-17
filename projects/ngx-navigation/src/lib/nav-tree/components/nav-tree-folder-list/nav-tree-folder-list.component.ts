import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {TreeFolderData} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {BehaviorSubject, Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {NavTreeContext} from "../../models/nav-tree-context";
import {applyCdkDrag} from "../../../../util/drag-drop";

@Component({
  selector: 'ngx-nav-tree-folder-list',
  templateUrl: './nav-tree-folder-list.component.html',
  styleUrls: ['./nav-tree-folder-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTreeFolderListComponent<TFolder extends WithId, TItem extends WithId> implements OnInit {

  private _folders$ = new BehaviorSubject<TreeFolderData<TFolder, TItem>[]>([]);
  @Input() set folders(folders: TreeFolderData<TFolder, TItem>[]) {
    this._folders$.next(folders);
  };
  get folders() {return this._folders$.value}

  folders$!: Observable<TreeFolderData<TFolder, TItem>[]>;
  canMove$!: Observable<boolean>;

  constructor(
    public context: NavTreeContext<TFolder, TItem>
  ) {

  }

  ngOnInit() {
    this.folders$ = this.context.hideEmpty$.pipe(
      switchMap(hide => !hide
        ? this._folders$
        : this._folders$.pipe(
          map(folders => folders.filter(x => x.model.itemCount > 0))
        )
      )
    );

    this.canMove$ = this.context.hideEmpty$.pipe(
      switchMap(hide => hide ? of(false) : this.context.allowMoveFolder$)
    );
  }

  getId(index: number, item: TreeFolderData<TFolder, TItem>) {
    return item.model.model.id;
  }

  async onFolderDrop(event: CdkDragDrop<any>) {
    const list = this.folders.map(x => x.model.model);
    const model = applyCdkDrag(list, event);
    if (!model) return;
    await this.context.moveFolder(model);
  }
}
