import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDragEnter, CdkDropList, CdkDropListGroup, DragDropModule} from "@angular/cdk/drag-drop";
import {CreateAction, GridData, ListDataSource} from "@consensus-labs/data-sources";
import {isString, WithId} from "@consensus-labs/ts-tools";
import {CommonModule} from "@angular/common";
import {FalsyPipe, LongTapDirective, TruthyPipe} from "@consensus-labs/ngx-tools";
import {LoadingOverlayComponent} from "@consensus-labs/ngx-material";
import {ActivatedRoute, Router} from "@angular/router";
import {NavSearchBarComponent} from "../../shared/nav-search-bar/nav-search-bar.component";
import {NavGridTileComponent} from "./nav-grid-tile/nav-grid-tile.component";
import {NavCreateTileComponent} from "../nav-create-tile/nav-create-tile.component";
import {MoveModel} from "../../../models/move";

@Component({
  selector: 'ngx-nav-grid',
  templateUrl: './nav-grid.component.html',
  styleUrls: ['./nav-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NavSearchBarComponent,
    DragDropModule,
    FalsyPipe,
    NavCreateTileComponent,
    NavGridTileComponent,
    LongTapDirective,
    TruthyPipe,
    LoadingOverlayComponent
  ]
})
export class NavGridComponent<TItem extends WithId> {

  @ViewChild(CdkDropListGroup) listGroup?: CdkDropListGroup<CdkDropList>;
  @ViewChild('placeholder', {read: CdkDropList}) placeholder?: CdkDropList;

  source?: CdkDropList;
  sourceElement?: HTMLElement;

  get placeholderElement() {
    return this.placeholder?.element.nativeElement
  }

  @Output() moveItem = new EventEmitter<MoveModel>();
  @Output() itemClick = new EventEmitter<TItem>();

  @Input() routeNav: boolean|undefined|ActivatedRoute;
  @Input() dataSource!: ListDataSource<TItem>;
  @Input() noBlur = false;
  @Input() loading?: boolean;
  @Input() showSearch?: boolean;
  @Input() createActions: CreateAction[] = [];

  @Input() set activeItem(item: TItem|string|undefined|null) {
    this.activeId = !item ? undefined : isString(item) ? item : item.id;
  }
  activeId?: string;

  get canDrag() {return this.dataSource.indexSorted && this.moveItem.observed}

  constructor(private router: Router, private route: ActivatedRoute) { }

  async onClick(item: GridData<TItem>) {
    this.itemClick.emit(item.model);

    if (this.routeNav) {
      const baseRoute = this.routeNav instanceof ActivatedRoute ? this.routeNav : this.route;
      await this.router.navigate([item.id], {relativeTo: baseRoute});
    }
  }

  resetDrag() {
    this.source = undefined;
    this.placeholder!.data = undefined;
    this.placeholderElement!.parentNode?.insertBefore(
      this.sourceElement!,
      this.placeholderElement!,
    );
    this.sourceElement = undefined;
    this.placeholderElement!.style.display = 'none';
    this.placeholderElement!.parentNode?.prepend(this.placeholderElement!);
  }

  placeholderDrop(event: CdkDragDrop<any>) {

    let newIndex = event.container.data;
    if (!newIndex) return;

    this.resetDrag();

    const oldIndex = event.previousContainer.data;

    newIndex = Math.ceil(newIndex);

    if (newIndex === oldIndex) return;

    this.moveItem.emit({id: event.item.data, index: newIndex});
  }

  onEnter(event: CdkDragEnter<number | undefined>) {
    // If drag started remove source list (Replaced with placeholder)
    if (!this.source) {
      this.source = event.item.dropContainer;
      this.sourceElement = this.source.element.nativeElement;
      this.sourceElement.parentNode?.removeChild(this.sourceElement);
    }

    // Calculate index change
    const oldIndex = this.placeholder?.data ?? event.item.dropContainer.data;
    let newIndex = event.container.data ?? 0;
    const increased = newIndex > oldIndex;

    // Modify new index to be placed between existing integers
    if (increased) {
      newIndex += 0.5;
    } else {
      newIndex -= 0.5;
    }

    // Store new Index in placeholder list
    this.placeholder!.data = newIndex;

    // Un-hide the placeholder
    this.placeholderElement!.style.display = 'block';

    // Move the placeholder to the new position
    const dropElement = event.container.element.nativeElement;
    dropElement.parentNode?.insertBefore(
      this.placeholderElement!,
      increased ? dropElement.nextSibling : dropElement,
    );

    // Place the temp item inside the placeholder list (To make sure placeholder has the correct size)
    this.placeholder?._dropListRef.enter(event.item._dragRef, event.item.element.nativeElement.offsetLeft, event.item.element.nativeElement.offsetTop);
  }

  getId(index: number, item: WithId) {
    return item.id;
  }
}
