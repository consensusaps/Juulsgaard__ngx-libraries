import {Directive, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AnyListSelection, ListDataSource, ListRange, ListSelection} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";

@Directive()
export class SelectionListContext<TModel extends WithId> implements OnInit {

  @Input() dataSource!: ListDataSource<TModel>;
  @Input('selection') selection!: AnyListSelection<TModel>;
  multiSelect = false;

  @Output() itemClick = new EventEmitter<TModel>();
  @Output() itemAdded = new EventEmitter<TModel>();
  @Output() itemRemoved = new EventEmitter<TModel>();

  ngOnInit() {
    if (!this.dataSource) {
      console.error('Datasource is required for Selection Grids');
      return;
    }

    this.selection = this.selection ?? new ListSelection(this.dataSource);
    this.multiSelect = this.selection instanceof ListRange;
  }

  getId(index: number, item: WithId) {
    return item.id;
  }

  onClick(item: TModel) {
    this.itemClick.emit(item);

    const change = this.selection.toggleItem(item);
    if (change === true) this.itemAdded.emit(item);
    if (change === false) this.itemRemoved.emit(item);
  }
}
