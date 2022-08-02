import {BehaviorSubject, Subject} from "rxjs";

export class OverlayToken {

  protected createdAt = new Date();
  protected escapeMethod?: () => void;
  public escape$ = new Subject<void>();
  public isTop$ = new BehaviorSubject(false);

  constructor(public readonly zIndex: number, private destroyHandler: (x: OverlayToken) => void) {
    this.escape$.subscribe(() => this.escapeMethod?.());
  }

  handleEscape(action: () => void) {
    this.escapeMethod = action;
  }

  dispose() {
    this.destroyHandler(this);
    this.escape$.complete();
    this.isTop$.complete();
  }
}
