import {inject, Injectable} from "@angular/core";
import {ThemePalette} from "@angular/material/core";
import {DialogManagerService} from "./dialog-manager.service";
import {StaticDialogInstance, StaticDialogOptions} from "../models/static-dialog-context";
import {NgxDialogDefaults} from "../models/dialog-defaults";

interface PopupOptions {
  HtmlContent?: boolean;
  scrollable?: boolean;
  canClose?: boolean;
  type?: string;
  styles?: string[];
}

interface PopupButton {
  text: string;
  color?: ThemePalette;
  callback?: () => any;
  success?: boolean;
}

@Injectable({providedIn: 'root'})
export class DialogService {

  private manager = inject(DialogManagerService);
  private defaults = inject(NgxDialogDefaults);

  public createDialog(
    title: string,
    content: string,
    buttons: PopupButton[],
    options?: PopupOptions
  ): Promise<boolean> {
    return new Promise<boolean>(resolve => {

      let instance: StaticDialogInstance;

      const data: StaticDialogOptions = {
        header: title,
        description: content,
        isHtml: options?.HtmlContent ?? false,
        scrollable: options?.scrollable ?? this.defaults.scrollable,
        canClose: options?.canClose ?? this.defaults.canClose,
        type: options?.type ?? this.defaults.type,
        styles: options?.styles ?? this.defaults.styles,
        buttons: buttons.map(btn => (
          {
            text: btn.text,
            color: btn.color,
            callback: () => {
              this.manager.closeDialog(instance);
              btn.callback?.();
              resolve(btn.success ?? false);
            }
          }
        ))
      };

      instance = this.manager.createStaticDialog(data);

      if (data.canClose) {
        instance.close$.subscribe(() => this.manager.closeDialog(instance));
      }
    });
  }

  public confirm(
    title: string,
    text: string,
    options?: PopupOptions & { confirmText?: string, cancelText?: string }
  ): Promise<boolean> {
    return this.createDialog(
      title,
      text,
      [
        {text: options?.cancelText ?? 'Cancel', success: false},
        {text: options?.confirmText ?? 'Confirm', color: 'primary', success: true},
      ],
      options
    );
  }

  public plain(
    title: string,
    text: string,
    options?: PopupOptions & { btnText?: string }
  ): Promise<boolean> {
    return this.createDialog(
      title,
      text,
      [
        {text: options?.btnText ?? 'Close', success: true},
      ]
    );
  }

  public delete(
    title: string,
    text: string,
    options?: PopupOptions & { deleteText?: string, cancelText?: string }
  ): Promise<boolean> {
    return this.createDialog(
      title,
      text,
      [
        {text: options?.cancelText ?? 'Cancel', success: false},
        {text: options?.deleteText ?? 'Delete', color: 'warn', success: true},
      ],
      options
    );
  }
}
