import {SnackbarOptions} from "./snackbar-options";

export abstract class SnackbarContext<T> {

  readonly data: T;
  readonly styles: string[];
  readonly dismissable: boolean;
  readonly duration: number|undefined;

  protected constructor(options: SnackbarOptions<T>) {
    this.data = options.data;
    this.styles = options.styles;
    this.dismissable = options.dismissable;
    this.duration = options.duration;
  }

  abstract dismiss(): void;
}
