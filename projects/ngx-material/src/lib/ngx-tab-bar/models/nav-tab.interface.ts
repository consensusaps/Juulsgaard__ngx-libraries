import {Observable} from "rxjs";

export interface INavTab {
  readonly id: string;
  readonly name: string;
  readonly isOpen$: Observable<boolean>;
  readonly isHidden: boolean;
  readonly isDisabled: boolean;
}
