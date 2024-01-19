
export interface SnackbarOptions<T> {
  data: T;
  styles: string[];
  dismissable: boolean;
  duration: number|undefined;
  swipeable: boolean;
  showTimer: boolean;
}
