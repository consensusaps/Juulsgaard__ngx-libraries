import {forwardRef, inject, Injectable, Provider} from "@angular/core";

export interface NgxOverlayDefaultOptions {
  type?: string;
  styles?: string[];
  scrollable?: boolean;
}

@Injectable({providedIn: 'root', useClass: forwardRef(() => NgxRootOverlayDefaults)})
export abstract class NgxOverlayDefaults {

  static Provide(options: NgxOverlayDefaultOptions): Provider {
    return {provide: NgxOverlayDefaults, useFactory: () => new NgxInjectedOverlayDefaults(options)};
  }

  abstract type: string;
  abstract styles: string[];
  abstract scrollable: boolean;
}

class NgxInjectedOverlayDefaults extends NgxOverlayDefaults {
  private parent = inject(NgxOverlayDefaults, {skipSelf: true, optional: true}) ?? new NgxRootOverlayDefaults();
  scrollable: boolean;
  styles: string[];
  type: string;

  constructor(options: NgxOverlayDefaultOptions) {
    super();
    this.scrollable = options.scrollable ?? this.parent.scrollable;
    this.styles = options.styles ?? this.parent.styles;
    this.type = options.type ?? this.parent.type;
  }
}

@Injectable()
class NgxRootOverlayDefaults extends NgxOverlayDefaults {
  scrollable = false;
  styles: string[] = [];
  type = 'ngx-overlay-default';
}
