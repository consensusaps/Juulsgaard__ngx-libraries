export class NgxDropContext<T> {

  get allowed() {
    return this._allowed
  }

  constructor(readonly data: T, private _allowed: boolean) {
  }

  allow() {
    this._allowed = true;
  }

  reject() {
    this._allowed = false;
  }

  set(allow: boolean) {
    this._allowed = allow;
  }
}
