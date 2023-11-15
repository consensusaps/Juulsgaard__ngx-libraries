import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {Subscription, timer} from "rxjs";
import {NgxDropContext} from "../models/ngx-drop-context";
import {NgxDragService} from "../services/ngx-drag.service";
import {NgxDragEvent} from "../models/ngx-drag-event";

@Directive({
  selector: '[ngxDropArea]',
  host: {'[class.ngx-drop-area]': 'true', '[class.ngx-drop-disabled]': 'disableDrop'}
})
export class NgxDropAreaDirective<T> {

  static readonly HOVER_CLASS = 'ngx-drop-hover';

  @Output('ngxDrop') drop = new EventEmitter<NgxDragEvent<T>>;
  @Output('ngxDropHover') dropHover = new EventEmitter<NgxDropContext<T>>;
  @Input('ngxDropEffect') effect?: 'move'|'link'|'copy';
  @Input() dropPredicate?: (data: NgxDragEvent<T>) => boolean;

  get dropEffect() {return this.effect ?? this.service.effect ?? 'move'}

  @Input({transform: coerceBooleanProperty}) disableDrop = false;

  removeHoverState?: Subscription;

  constructor(private element: ElementRef<HTMLElement>, private service: NgxDragService) { }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    const data = this.service.drag as T|undefined;

    if (data === undefined) return;
    event.preventDefault();

    if (!this.canDrop(event, data)) return;

    this.removeHoverState?.unsubscribe();
    this.element.nativeElement.classList.remove(NgxDropAreaDirective.HOVER_CLASS);

    const dropEvent = event as NgxDragEvent<T>;
    dropEvent.data = data;

    this.drop.emit(dropEvent);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (!event.dataTransfer) return;

    const data = this.service.drag as T|undefined;
    if (data === undefined) return;

    event.preventDefault();
    const canDrop = this.canDrop(event, data);
    event.dataTransfer.dropEffect = canDrop ? this.getDropEffect(event.dataTransfer) : 'none';

    if (canDrop) {
      this.removeHoverState?.unsubscribe();
      this.element.nativeElement.classList.add(NgxDropAreaDirective.HOVER_CLASS);
    }
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: Event) {
    event.preventDefault();
    if (this.removeHoverState && !this.removeHoverState.closed) return;
    this.removeHoverState = timer(100)
      .subscribe(() => this.element.nativeElement.classList.remove(NgxDropAreaDirective.HOVER_CLASS));
  }

  private canDrop(event: DragEvent, data: T) {
    if (this.disableDrop) return false;
    if (!this.dropPredicate && !this.drop.observed) return true;

    const dragEvent = event as NgxDragEvent<T>;
    dragEvent.data = data;

    const context = new NgxDropContext<T>(data, this.dropPredicate?.(dragEvent) ?? true);
    this.dropHover.emit(context);

    return context.allowed;
  }

  private getDropEffect(dataTransfer: DataTransfer) {
    const effect = this.dropEffect;
    if (effect === 'link' && dataTransfer.effectAllowed === 'copyMove') return 'move';
    return effect;
  }
}

