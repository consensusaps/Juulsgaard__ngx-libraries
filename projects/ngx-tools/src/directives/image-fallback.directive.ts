import {Directive, ElementRef, HostListener, input, InputSignal} from '@angular/core';

@Directive({selector: 'img[fallbackSrc]', standalone: true})
export class ImageFallbackDirective {

  readonly fallbackSrc: InputSignal<string | undefined> = input<string>();

  constructor(private element: ElementRef<HTMLImageElement>) {
  }

  @HostListener('error', ['$event'])
  onError() {
    const fallback = this.fallbackSrc();
    if (!fallback) return;
    if (this.element.nativeElement.src === fallback) return;
    this.element.nativeElement.src = fallback;
  }
}
