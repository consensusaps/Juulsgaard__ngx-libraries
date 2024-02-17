import {computed, Directive, effect, ElementRef, HostBinding, inject, input} from '@angular/core';
import {IconData} from "../models/icon-models";
import {IconService} from "../services/icon.service";
import {IconProviders} from "../models/icon-providers";
import {BaseIconAliases} from "../models/icon-aliases";
import {isString} from "@juulsgaard/ts-tools";

@Directive({
  selector: 'ngx-icon',
  standalone: true,
  host: {'[class.ngx-icon]': 'true'}
})
export class IconDirective {

  @HostBinding('class') classes: string[] = ['empty'];

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
  private service = inject(IconService);

  constructor() {
    effect(() => {
      this.element.style.fontSize = this.size();
    });

    effect(() => {
      this.element.style.setProperty('--padding', this.padding());
    });

    const icon = computed(() => this.getIcon());

    effect(() => this.applyIcon(icon()));
  }

  getIcon(): IconData | undefined {
    const icon = this.icon();
    if (icon) return this.service.parseIcon(icon, this.provider());

    const alias = this.alias();
    if (alias) return this.service.parseAlias(alias, this.provider());

    return undefined;
  }

  applyIcon(data?: IconData) {
    console.log(data);
    if (!data) {
      this.classes = ['empty'];
      return;
    }

    this.classes = [data.providerClass, ...data.classes ?? []];
    this.element.innerText = data.text ?? '';
    if (data.scale) this.classes.push('scaled');
    this.element.style.setProperty('--scale', data.scale?.toString() ?? null);
  }
}








