import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {BaseAnchor} from "../../models/base-button";
import {IconDirective} from "@juulsgaard/ngx-tools";
import {coerceBooleanProperty} from "@angular/cdk/coercion";

@Component({
  selector: 'a[ngxIconButton], a[ngxRaisedIconButton]',
  standalone: true,
  imports: [
    IconDirective
  ],
  templateUrl: './icon-anchor.component.html',
  styleUrls: ['./icon-anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[role]': '"button"', '[class.active]': 'active'}
})
export class IconAnchorComponent extends BaseAnchor {
  @Input() icon?: string;
  @Input() alias?: string;

  @Input({transform: coerceBooleanProperty}) active = false;

  @Input() set size(size: number|string|undefined) {
    this.element.nativeElement.style.fontSize = size != undefined ? (typeof size === 'string' ? size : `${size}px`) : '';
  }

  @Input() set padding(padding: number|string|undefined) {
    this.element.nativeElement.style.setProperty(
      '--padding',
      padding ? (typeof padding === 'string' ? padding : `${padding}px`) : null
    );
  }

  constructor(private element: ElementRef<HTMLElement>) {
    super();
  }
}
