import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({selector: 'img[fallbackSrc]', standalone: true})
export class ImageFallbackDirective {

  @Input() fallbackSrc?: string;

  constructor(private element: ElementRef<HTMLImageElement>) {
  }

  @HostListener('error', ['$event'])
  onError() {
    if (!this.fallbackSrc) return;
    if (this.element.nativeElement.src === this.fallbackSrc) return;
    this.element.nativeElement.src = this.fallbackSrc;
  }
}
