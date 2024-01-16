import {forwardRef, inject, Injectable, Provider} from "@angular/core";
import {DialogService} from "../services/dialog.service";

export interface NgxDialogDefaultOptions {
  type?: string;
  styles?: string[];
  scrollable?: boolean;
  canClose?: boolean;
}

@Injectable({providedIn: 'root', useClass: forwardRef(() => NgxRootDialogDefaults)})
export abstract class NgxDialogDefaults {

  static Provide(options: NgxDialogDefaultOptions): Provider[] {
    return [
      {provide: NgxDialogDefaults, useFactory: () => new NgxInjectedDialogDefaults(options)},
      DialogService
    ];
  }

  abstract type: string;
  abstract styles: string[];
  abstract scrollable: boolean;
  abstract canClose: boolean;
}

class NgxInjectedDialogDefaults extends NgxDialogDefaults {
  private parent = inject(NgxDialogDefaults, {skipSelf: true, optional: true}) ?? new NgxRootDialogDefaults();
  scrollable: boolean;
  styles: string[];
  type: string;
  canClose: boolean;

  constructor(options: NgxDialogDefaultOptions) {
    super();
    this.scrollable = options.scrollable ?? this.parent.scrollable;
    this.styles = options.styles ?? this.parent.styles;
    this.type = options.type ?? this.parent.type;
    this.canClose = options.canClose ?? this.parent.canClose;
  }
}

@Injectable()
class NgxRootDialogDefaults extends NgxDialogDefaults {
  scrollable = false;
  styles: string[] = [];
  type = 'ngx-dialog-default';
  canClose = true;
}
