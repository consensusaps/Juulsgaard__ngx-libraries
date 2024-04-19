import {
  ChangeDetectionStrategy, Component, effect, ElementRef, EventEmitter, input, InputSignal, Output, ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconButtonComponent} from "../../lib/buttons/components/icon-button/icon-button.component";
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {mostReadable, TinyColor} from "@ctrl/tinycolor";

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

  @Output() removed = new EventEmitter<void>();
  readonly canRemove: InputSignal<boolean> = input(true);
  readonly color: InputSignal<string | undefined> = input<string>();

  constructor(private element: ElementRef<HTMLElement>) {
    effect(() => {
      const color = this.color();

      if (!color) {
        this.element.nativeElement.style.color = '';
        this.element.nativeElement.style.backgroundColor = '';
        return;
      }

      this.element.nativeElement.style.backgroundColor = color;
      const col = new TinyColor(color);
      const text = mostReadable(col.darken(10), ['#FFFFFFDD', '#000000DD']) ?? new TinyColor('#FFFFFFDD');
      this.element.nativeElement.style.color = text.toHex8String();
    });
  }

  @ViewChild('remove', {static: false}) removeElement?: IconButtonComponent;
  focusRemove() {
    this.removeElement?.focus();
  }

}
