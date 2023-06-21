import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input} from '@angular/core';
import {MatRipple} from "@angular/material/core";
import {IconDirective} from "@consensus-labs/ngx-tools";

@Component({
  selector: 'ngx-icon-button, ngx-raised-icon-button',
  standalone: true,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  imports: [
    IconDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MatRipple],
  host: {'[tabIndex]': 'disabled ? -1 : 0', '[role]': '"button"', '[class.active]': 'active', '[class.disabled]': 'disabled', '[class.ngx-icon-button]': 'true'}
})
export class IconButtonComponent {

  @Input() icon?: string;
  @Input() alias?: string;

  @Input() active?: boolean;
  @Input() disabled?: boolean;

  @Input() set size(size: number|string|undefined) {
    this.element.nativeElement.style.fontSize = size != undefined ? (typeof size === 'string' ? size : `${size}px`) : '';
  }

  @Input() set padding(padding: number|string|undefined) {
    this.element.nativeElement.style.setProperty(
      '--padding',
      padding ? (typeof padding === 'string' ? padding : `${padding}px`) : null
    );
  }

  constructor(private element: ElementRef<HTMLElement>, private ripple: MatRipple) {
  }

  @HostListener('mousedown', ['$event'])
  mousedown(event: MouseEvent) {
    this.ripple.launch(event.x, event.y);
  }
}
