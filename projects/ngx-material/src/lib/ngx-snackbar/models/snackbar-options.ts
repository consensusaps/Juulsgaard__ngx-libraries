
export interface SnackbarOptions<T> {
  data: T;
  styles: string[];
  dismissable: boolean;
  duration: number|undefined;
}
