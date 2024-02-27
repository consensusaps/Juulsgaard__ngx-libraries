import {Directive, ElementRef, EventEmitter, HostListener, input, InputSignal, Output} from '@angular/core';


@Directive({ selector: '[fileDrop]', standalone: true })
export class FileDropDirective {

  private timeout?: number;

  constructor(private element: ElementRef<HTMLElement>) { }

  @Output() fileDrop = new EventEmitter<DragEvent>();
  readonly fileDropDisable: InputSignal<boolean> = input(false);

  @HostListener('dragover', ['$event']) onDragOver(event: Event) {
    if (this.fileDropDisable()) return;
    event.stopPropagation();
    event.preventDefault();
    this.element.nativeElement.classList.add('file-hover');
    clearTimeout(this.timeout);
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: Event) {
    if (this.fileDropDisable()) return;
    event.stopPropagation();
    event.preventDefault();
    this.timeout = window.setTimeout(() => this.element.nativeElement.classList.remove('file-hover'), 100);
  }

  @HostListener('drop', ['$event']) onDrop(event: Event) {
    if (this.fileDropDisable()) return;
    event.stopPropagation();
    event.preventDefault();
    clearTimeout(this.timeout);
    this.element.nativeElement.classList.remove('file-hover');
    this.fileDrop.emit(event as DragEvent);
  }
}
