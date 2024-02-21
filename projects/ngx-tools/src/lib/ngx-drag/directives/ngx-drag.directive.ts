import {
  booleanAttribute, Directive, ElementRef, EventEmitter, HostBinding, HostListener, input, InputSignal,
  InputSignalWithTransform, Output
} from '@angular/core';
import {NgxDragContext} from "../models/ngx-drag-context";
import {NgxDragService} from "../services/ngx-drag.service";

@Directive({
  selector: '[ngxDrag]',
  host: {'[class.ngx-drag]': 'true', '[class.ngx-drag-disabled]': 'disableDrag'}
})
export class NgxDragDirective<T> {

  readonly dragData: InputSignal<T | undefined> = input<T>();
  readonly dropText: InputSignal<string | undefined> = input<string>();
  readonly dropEffect: InputSignal<"move" | "link" | "copy" | undefined> = input<'move'|'link'|'copy'>();
  readonly disableDrag: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  @Output('dragStart') dragStart = new EventEmitter<NgxDragContext<T>>();

  active?: T;

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    if (this.disableDrag()) {
      event.preventDefault();
      return;
    }

    const context = new NgxDragContext<T>(this.dragData(), this.dropText());
    this.dragStart.emit(context);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'all';
    }

    if (context.data === undefined) {
      event.preventDefault();
      return;
    }

    if (context.text) {
      event.dataTransfer?.setData('text/plain', context.text);
    }

    this.active = context.data;
    this.service.register(context.data, this.dropEffect());
  }

  @HostListener('dragend')
  onDragEnd() {
    if (this.active === undefined) return;
    this.service.deregister(this.active);
  }

  @HostBinding('attr.draggable')
  get draggable() {return this.disableDrag() ? 'false' : 'true'}


  constructor(element: ElementRef<HTMLElement>, private service: NgxDragService) {
    element.nativeElement.style.isolation = 'isolate';
  }

}

