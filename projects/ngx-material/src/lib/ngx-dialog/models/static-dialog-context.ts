import {OverlayToken} from "@juulsgaard/ngx-tools";
import {Injector} from "@angular/core";
import {ThemePalette} from "@angular/material/core";
import {Subject} from "rxjs";
import {Disposable} from "@juulsgaard/ts-tools";

export interface StaticDialogOptions {
  header: string;
  description: string;
  isHtml: boolean;
  buttons: StaticDialogButton[];
  scrollable: boolean;
  canClose: boolean;
  type: string;
  styles: string[];
}

export interface StaticDialogButton {
  text: string;
  color?: ThemePalette;
  callback: () => any;
}

export abstract class StaticDialogContext {
  header: string;
  scrollable: boolean;
  description: string;
  isHtml: boolean;
  buttons: StaticDialogButton[];
  canClose: boolean;
  type: string;
  styles: string[];

  protected constructor(options: StaticDialogOptions, public zIndex: number) {
    this.header = options.header;
    this.scrollable = options.scrollable;
    this.description = options.description;
    this.isHtml = options.isHtml;
    this.buttons = options.buttons;
    this.canClose = options.canClose;
    this.type = options.type;
    this.styles = options.styles;
  }

  abstract close(): void;
}

export class StaticDialogInstance extends StaticDialogContext implements Disposable {

  private _close$ = new Subject<void>();
  readonly close$ = this._close$.asObservable();

  constructor(
    private readonly token: OverlayToken,
    options: StaticDialogOptions,
    public readonly injector?: Injector,
  ) {
    super(options, token.zIndex);
    this.token.escape$.subscribe(() => this.close());
  }

  close(): void {
    this._close$.next();
  }

  dispose() {
    this.token.dispose();
    this._close$.complete();
  }
}
