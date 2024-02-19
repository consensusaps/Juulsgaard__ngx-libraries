import {signalSet} from "./signal-set";
import {computed} from "@angular/core";

export class RefCounter<T> {

  private _refs = signalSet<T>([]);
  readonly refs = this._refs.value;
  readonly size = this._refs.size;
  readonly empty = computed(() => this._refs.size() <= 0);

  constructor(
    private onFirst: (addedRef: T) => void,
    private onEmpty: (removedRef: T) => void
  ) {
  }

  add(value: T): boolean {
    const empty = this.empty();
    const added = this._refs.add(value);
    if (empty && added) this.onFirst(value);
    return added;
  }

  remove(value: T): boolean {
    const empty = this.empty();
    const removed = this._refs.delete(value);
    if (!empty && removed) this.onEmpty(value);
    return removed;
  }
}

export function refCounter<T>(
  onFirst: (addedRef: T) => void,
  onEmpty: (removedRef: T) => void
) {
  return new RefCounter(onFirst, onEmpty);
}
