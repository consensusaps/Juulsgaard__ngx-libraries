import {computed, signal, Signal, WritableSignal} from "@angular/core";
import {arrToSet, setToArr} from "@juulsgaard/ts-tools";

export class SignalSet<T> implements ReadonlySignalSet<T> {

  private readonly _set: WritableSignal<ReadonlySet<T>>;

  readonly value: Signal<ReadonlySet<T>>;
  readonly array: Signal<ReadonlyArray<T>>;
  readonly size: Signal<number>;

  constructor(values?: T[]) {
    this._set = signal(arrToSet(values ?? []));
    this.value = this._set.asReadonly();
    this.array = computed(() => setToArr(this.value()));
    this.size = computed(() => this.value().size);
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.value()[Symbol.iterator]();
  }

  //<editor-fold desc="Actions">
  filter(whitelist: T[] | ReadonlySet<T> | undefined): boolean {
    const length = whitelist && 'size' in whitelist ? whitelist.size : whitelist?.length;

    if (!length) {
      return this.clear();
    }

    const whitelistSet = whitelist instanceof Set ? whitelist : new Set(whitelist);
    const set = this.getCopy();

    for (let value of this) {
      if (whitelistSet.has(value)) continue;
      set.delete(value);
    }

    if (this.size() !== set.size) {
      this._set.set(set);
      return true;
    }

    return false;
  }

  clear(): boolean {
    if (!this.size()) return false;
    this._set.set(new Set<T>());
    return true;
  }

  add(value: T): boolean {
    if (this.has(value)) return false;
    const set = this.getCopy();
    set.add(value);
    this._set.set(set);
    return true;
  }

  addRange(values: T[]): boolean {
    const set = this.getCopy();
    const size = set.size;
    values.forEach(v => set.add(v));
    if (set.size === size) return false;
    this._set.set(set);
    return true;
  }

  set(values: T[] = []): boolean {
    if (!values.length && !this.size()) return false;

    if (values.length === this.size()) {
      const same = values.every(x => this.has(x));
      if (same) return false;
    }

    this._set.set(new Set<T>(values));
    return true;
  }

  delete(value: T): boolean {
    if (!this.has(value)) return false;
    const set = this.getCopy();
    set.delete(value);
    this._set.set(set);
    return true;
  }

  deleteRange(values: T[]): boolean {
    const set = this.getCopy();
    const size = set.size;
    values.forEach(v => set.delete(v));
    if (set.size === size) return false;
    this._set.set(set);
    return true;
  }

  /**
   * Toggle a value in the set
   * @param value - The value to toggle
   * @param state - A forced state (`true` = always add, `false` = always delete)
   * @returns The applied change (`true` = item added, `false` = item removed, `undefined` = nothing changed)
   */
  toggle(value: T, state?: boolean): boolean | undefined {

    if (this.has(value)) {
      if (state === true) return undefined;
      const set = this.getCopy();
      set.delete(value);
      this._set.set(set);
      return false;
    }

    if (state === false) return undefined;
    const set = this.getCopy();
    set.add(value);
    this._set.set(set);
    return true;
  }

  has(value: T): boolean {
    return this.value().has(value);
  }

  modify(modify: (set: Set<T>) => void) {
    const set = this.getCopy();
    modify(set);
    this._set.set(set);
  }

  //</editor-fold>

  private getCopy() {
    return new Set<T>(this.value());
  }
}

export interface ReadonlySignalSet<T> extends Iterable<T> {
  readonly size: Signal<number>;
  readonly value: Signal<ReadonlySet<T>>;
  readonly array: Signal<ReadonlyArray<T>>;

  has(value: T): boolean;
}

export function signalSet<T>(items?: T[]): SignalSet<T> {
  return new SignalSet<T>(items);
}
