import {OverlayToken} from "@consensus-labs/ngx-tools";
import {Injector} from "@angular/core";
import {ThemePalette} from "@angular/material/core";

export interface StaticDialogOptions {
  header: string;
  withScroll: boolean;
  description: string;
  isHtml: boolean;
  buttons: StaticDialogButton[];
}

export interface StaticDialogButton {
  text: string;
  color?: ThemePalette;
  callback: () => any;
}

export abstract class StaticDialogContext implements StaticDialogOptions {
  header: string;
  withScroll: boolean;
  description: string;
  isHtml: boolean;
  buttons: StaticDialogButton[];

  protected constructor(options: StaticDialogOptions, public zIndex: number) {
    this.header = options.header;
    this.withScroll = options.withScroll;
    this.description = options.description;
    this.isHtml = options.isHtml;
    this.buttons = options.buttons;
  }

  abstract close(): void;
}

export class StaticDialogInstance extends StaticDialogContext {

  constructor(
    private readonly token: OverlayToken,
    options: StaticDialogOptions,
    public readonly injector?: Injector,
  ) {
    super(options, token.zIndex);
    this.token.handleEscape(() => this.close());
  }

  private closeCallback?: () => any;

  onClose(callback: () => any) {
    this.closeCallback = callback;
  }

  close(): void {
    this.closeCallback?.();
  }

  dispose() {
    this.token.dispose();
  }
}
