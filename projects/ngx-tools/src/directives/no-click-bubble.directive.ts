import {booleanAttribute, Directive, HostListener, input, InputSignalWithTransform} from '@angular/core';


@Directive({
  selector: '[noClickBubble]',
  standalone: true
})
export class NoClickBubbleDirective {

  constructor() { }

  readonly noClickBubble: InputSignalWithTransform<boolean, unknown> = input.required({transform: booleanAttribute});

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.noClickBubble())
      event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.noClickBubble())
      event.stopPropagation();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.noClickBubble())
      event.stopPropagation();
  }
}
