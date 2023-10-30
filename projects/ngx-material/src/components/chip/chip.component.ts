import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import tinycolor from "tinycolor2";
import {IconButtonComponent} from "../icon-button/icon-button.component";
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'ngx-chip',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, NoClickBubbleDirective],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.ngx-chip]': 'true'}
})
export class ChipComponent {

  @Input() canRemove?: boolean;
  @Output() removed = new EventEmitter<void>();
  @Input() set color(color: string|undefined) {
    if (!color) {
      this.element.nativeElement.style.color = '';
      this.element.nativeElement.style.backgroundColor = '';
      return;
    }

    this.element.nativeElement.style.backgroundColor = color;
    const col = tinycolor(color);
    const text = tinycolor.mostReadable(col.darken(10), ['#FFFFFFDD', '#000000DD']);
    this.element.nativeElement.style.color = text.toHex8String();
  }

  constructor(private element: ElementRef<HTMLElement>) {
  }

  @ViewChild('remove', {static: false}) removeElement?: IconButtonComponent;
  focusRemove() {
    this.removeElement?.focus();
  }

}
