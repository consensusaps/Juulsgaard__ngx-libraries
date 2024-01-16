import {Observable, Subject, takeUntil} from "rxjs";
import {Disposable} from "@juulsgaard/ts-tools";
import {filter} from "rxjs/operators";

export class OverlayToken implements Disposable {

  protected createdAt = new Date();

  readonly disposed$ = new Subject<void>();
  escape$: Observable<this>;

  constructor(
    public readonly zIndex: number,
    escape$: Observable<OverlayToken>
  ) {
    this.escape$ = escape$.pipe(
      filter((x): x is this => x === this),
      takeUntil(this.disposed$)
    );
  }

  dispose() {
    if (this.disposed$.closed) return;
    this.disposed$.next();
    this.disposed$.complete();
  }
}
