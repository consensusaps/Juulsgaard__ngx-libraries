import {Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IconData} from "../models/icon-models";
import {IconService} from "../services/icon.service";
import {IconProviders} from "../models/icon-providers";
import {BaseIconAliases} from "../models/icon-aliases";

@Directive({
  selector: 'ngx-icon',
  standalone: true,
  host: {'[class.ngx-icon]': 'true'}
})
export class IconDirective implements OnChanges {

  @HostBinding('class') classes: string[] = ['empty'];

  @Input() provider?: IconProviders;
  @Input() icon?: string;
  @Input() alias?: string|BaseIconAliases;

  @Input() set size(size: number|string|undefined) {
    this.element.nativeElement.style.fontSize = size != undefined ? (typeof size === 'string' ? size : `${size}px`) : '';
  }

  @Input() set padding(padding: number|string|undefined) {
    this.element.nativeElement.style.setProperty(
      '--padding',
      padding ? (typeof padding === 'string' ? padding : `${padding}px`) : null
    );
  }

  private lastIcon?: string;

  constructor(private element: ElementRef<HTMLElement>, private service: IconService) {

  }

  getIcon(): IconData|undefined {
    if (this.icon) return this.service.parseIcon(this.icon, this.provider);
    if (this.alias) return this.service.parseAlias(this.alias, this.provider);
    return undefined;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['icon'] || changes['alias']) {

      // Get new icon
      const icon = this.getIcon();

      // Return if no changes
      if (icon === this.lastIcon && !changes['provider']) return;

      // Apply change
      this.applyIcon(icon);
      return;
    }

    if (changes['provider']) {

      // Return if not using alias while currently empty
      if ((this.icon || !this.alias) && !this.lastIcon) return;

      // Calculate new icon
      const icon = this.getIcon();

      // Apply change
      this.applyIcon(icon);
    }
  }

  applyIcon(data?: IconData) {

    if (!data) {
      this.classes = ['empty'];
      return;
    }

    this.classes = [data.providerClass, ...data.classes ?? []];
    this.element.nativeElement.innerText = data.text ?? '';
    if (data.scale) this.classes.push('scaled');
    this.element.nativeElement.style.setProperty('--scale', data.scale?.toString() ?? null);
  }
}








