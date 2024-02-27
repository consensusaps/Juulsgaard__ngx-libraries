import {
  computed, Directive, effect, ElementRef, inject, input, InputSignal, InputSignalWithTransform
} from '@angular/core';
import {IconData} from "../models/icon-models";
import {IconService} from "../services/icon.service";
import {IconProviders} from "../models/icon-providers";
import {BaseIconAliases} from "../models/icon-aliases";
import {isString} from "@juulsgaard/ts-tools";
import {elementClassManager} from "../../../helpers";

@Directive({
  selector: 'ngx-icon',
  standalone: true,
  host: {'[class.ngx-icon]': 'true'}
})
export class IconDirective {

  readonly classes = elementClassManager();

  readonly provider: InputSignal<IconProviders | undefined> = input<IconProviders>();
  readonly icon: InputSignal<string | undefined> = input<string>();
  readonly alias: InputSignal<string | BaseIconAliases | undefined> = input<string | BaseIconAliases>();

  readonly size: InputSignalWithTransform<string, number | string | undefined | null> = input('', {
    transform: (size: number | string | undefined | null) => {
      if (size == null) return '';
      if (isString(size)) return size;
      return `${size}px`;
    }
  });

  readonly padding: InputSignalWithTransform<string | null, number | string | undefined | null> = input(null, {
    transform: (padding: number | string | undefined | null) => {
      if (padding == null) return null;
      if (isString(padding)) return padding;
      return `${padding}px`;
    }
  });

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private service = inject(IconService);

  constructor() {
    effect(() => {
      this.element.style.fontSize = this.size();
    });

    effect(() => {
      this.element.style.setProperty('--padding', this.padding());
    });

    const icon = computed(() => this.getIcon());

    effect(() => this.applyIcon(icon()), {allowSignalWrites: true});
  }

  getIcon(): IconData | undefined {
    const icon = this.icon();
    if (icon) return this.service.parseIcon(icon, this.provider());

    const alias = this.alias();
    if (alias) return this.service.parseAlias(alias, this.provider());

    return undefined;
  }

  applyIcon(data?: IconData) {

    if (!data) {
      this.classes.set('empty');
      this.element.innerText = '';
      this.element.style.setProperty('--scale', null);
      return;
    }

    this.classes.set([data.providerClass, ...data.classes ?? []]);
    this.element.innerText = data.text ?? '';
    if (data.scale) this.classes.add('scaled');
    this.element.style.setProperty('--scale', data.scale?.toString() ?? null);
  }
}








