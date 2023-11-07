export class NgxDragContext<T> {

  get data() {
    return this._data
  };

  get text() {
    return this._text
  };

  constructor(private _data: T | undefined, private _text: string | undefined) {
  }

  setData(data: T) {
    this._data = data;
  }

  setText(text: string) {
    this._text = text;
  }
}
