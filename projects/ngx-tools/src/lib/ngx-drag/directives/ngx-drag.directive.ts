import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {NgxDragContext} from "../models/ngx-drag-context";
import {NgxDragService} from "../services/ngx-drag.service";

@Directive({
  selector: '[ngxDrag]',
  host: {'[class.ngx-drag]': 'true', '[class.ngx-drag-disabled]': 'disableDrag'}
})
export class NgxDragDirective<T> {

  @Input() dragData?: T;
  @Input() dropText?: string;
  @Input({transform: coerceBooleanProperty}) disableDrag = false;

  @Output('dragStart') dragStart = new EventEmitter<NgxDragContext<T>>();

  active?: T;

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    if (this.disableDrag) {
      event.preventDefault();
      return;
    }

    const context = new NgxDragContext<T>(this.dragData, this.dropText);
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
    this.service.register(context.data);
  }

  @HostListener('dragend')
  onDragEnd() {
    if (this.active === undefined) return;
    this.service.deregister(this.active);
  }

  @HostBinding('attr.draggable')
  get draggable() {return this.disableDrag ? 'false' : 'true'}


  constructor(element: ElementRef<HTMLElement>, private service: NgxDragService) {
    element.nativeElement.style.isolation = 'isolate';
  }

}

