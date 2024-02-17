import {booleanAttribute, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input} from '@angular/core';
import {BaseAnchor} from "../../models/base-button";
import {BaseIconAliases, IconDirective, IconProviders} from "@juulsgaard/ngx-tools";
import {isString} from "@juulsgaard/ts-tools";

@Component({
  selector: 'a[ngxIconButton], a[ngxRaisedIconButton]',
  standalone: true,
  imports: [
    IconDirective
  ],
  templateUrl: './icon-anchor.component.html',
  styleUrls: ['./icon-anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[role]': '"button"', '[class.active]': 'active()'}
})
export class IconAnchorComponent extends BaseAnchor {

  active = input(false, {transform: booleanAttribute});

  provider = input<IconProviders>();
  icon = input<string>();
  alias = input<string | BaseIconAliases>();

  size = input('', {
    transform: (size: number | string | undefined | null) => {
      if (size == null) return '';
      if (isString(size)) return size;
      return `${size}px`;
    }
  });

  padding = input(null, {
    transform: (padding: number | string | undefined | null) => {
      if (padding == null) return null;
      if (isString(padding)) return padding;
      return `${padding}px`;
    }
  });

  private element = inject(ElementRef<HTMLElement>).nativeElement;

  constructor() {
    super();

    effect(() => {
      this.element.style.fontSize = this.size();
    });

    effect(() => {
      this.element.style.setProperty('--padding', this.padding());
    });
  }
}
