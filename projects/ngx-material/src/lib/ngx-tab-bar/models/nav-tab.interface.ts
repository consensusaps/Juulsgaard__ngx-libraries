import {Signal} from "@angular/core";

export interface INavTab {
  readonly slug: Signal<string>;
  readonly name: Signal<string>;
  readonly isOpen: Signal<boolean>;
  readonly isActive: Signal<boolean>;
  readonly hide: Signal<boolean>;
  readonly disabled: Signal<boolean>;
}
