import {SnackbarOptions} from "./snackbar-options";

export abstract class SnackbarContext<T> {

  readonly data: T;
  readonly styles: string[];
  readonly dismissable: boolean;
  readonly duration: number|undefined;
  readonly swipeable: boolean;
  readonly createdAt: number;
  readonly showTimer: boolean;

  protected constructor(options: SnackbarOptions<T>) {
    this.data = options.data;
    this.styles = options.styles;
    this.dismissable = options.dismissable;
    this.duration = options.duration;
    this.swipeable = options.swipeable;
    this.showTimer = options.showTimer;
    this.createdAt = Date.now();
  }

  abstract dismiss(): void;
}
