import {Directive, HostListener, Input} from '@angular/core';


@Directive({
  selector: '[noClickBubble]',
  standalone: true
})
export class NoClickBubbleDirective {

  constructor() { }

  @Input() noClickBubble?: boolean|'';

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.noClickBubble !== false)
      event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.noClickBubble !== false)
      event.stopPropagation();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.noClickBubble !== false)
      event.stopPropagation();
  }
}
