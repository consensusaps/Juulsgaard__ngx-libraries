import {Directive, ElementRef, inject} from "@angular/core";
import {SnackbarContext} from "./snackbar-context";

@Directive()
export abstract class SnackbarBaseComponent<T> {

  protected readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  protected readonly context: SnackbarContext<T> = inject(SnackbarContext<T>);
  protected readonly data = this.context.data;
  protected readonly dismissable = this.context.dismissable;

  protected constructor() {
    this.element.classList.add('ngx-snackbar-base');
    this.element.classList.add(...this.context.styles);
  }

  dismiss() {
    if (!this.dismissable) return;
    this.context.dismiss();
  }

}

