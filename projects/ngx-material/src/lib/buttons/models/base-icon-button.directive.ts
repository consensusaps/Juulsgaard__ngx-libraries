import {Directive, effect, input, InputSignal, InputSignalWithTransform} from '@angular/core';
import {BaseIconAliases, IconProviders} from "@juulsgaard/ngx-tools";
import {isString} from "@juulsgaard/ts-tools";
import {BaseButton} from "./base-button.directive";

@Directive()
export class BaseIconButton extends BaseButton {

  readonly provider: InputSignal<IconProviders| undefined> = input<IconProviders>();
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

  constructor() {
    super();

    this.element.classList.add('ngx-icon-button-base');

    effect(() => {
      this.element.style.fontSize = this.size();
    });

    effect(() => {
      this.element.style.setProperty('--padding', this.padding());
    });
  }
}
