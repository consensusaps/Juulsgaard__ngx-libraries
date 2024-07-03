import {assertInInjectionContext, DestroyRef, inject, Injector, signal, Signal} from "@angular/core";
import {ILoadingState, IValueLoadingState} from "@juulsgaard/rxjs-tools";
import {Subscribable} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {parseError} from "@juulsgaard/ts-tools";

type InternalLoadingSignal<T> = Signal<T | undefined> & {
  error: Signal<Error | undefined>,
  loading: Signal<boolean>,
  dispose: () => void
};

export type LoadingSignal<T> = Signal<T | undefined> & {
  /** The current error state */
  readonly error: Signal<Error | undefined>,
  /** The current loading state */
  readonly loading: Signal<boolean>,
  /** Dispose the underlying request / action */
  readonly dispose: () => void
};

interface CreateLoadingSignalOptions {
  /** The loading state */
  loading?: Signal<boolean>;
  /** The error state */
  error?: Signal<Error | undefined>;
  /** An optional disposal method */
  dispose?: () => void;
}

/**
 * Create a Loading Signal
 * @param value - The value signal
 * @param options - Optional state data
 * @constructor
 */
export function loadingSignal<T>(value: Signal<T | undefined>, options?: CreateLoadingSignalOptions): LoadingSignal<T> {
  const loadingSignal = value as InternalLoadingSignal<T>;
  loadingSignal.loading = options?.loading ?? signal(false);
  loadingSignal.error = options?.error ?? signal(undefined);
  loadingSignal.dispose = options?.dispose ?? (() => undefined);
  return loadingSignal;
}

interface LoadingSignalOptions {
  /** Dispose the loading signal on destroy */
  autoDispose?: boolean;
  /** Pass an injector for running outside of injection context */
  injector?: Injector;
}

/**
 * Convert a LoadingState to a LoadingSignal
 * @param loadingState
 * @param options
 */
export function toLoadingSignal<T>(
  loadingState: IValueLoadingState<T>,
  options?: LoadingSignalOptions
): LoadingSignal<T>;
/**
 * Convert a Subscribable to a LoadingSignal
 * @param observable
 * @param options
 */
export function toLoadingSignal<T>(
  observable: Subscribable<T>,
  options?: LoadingSignalOptions
): LoadingSignal<T>;
/**
 * Convert a promise to a LoadingSignal
 * @param promise
 * @param options
 */
export function toLoadingSignal<T>(
  promise: Promise<T>,
  options?: LoadingSignalOptions
): LoadingSignal<T>;
export function toLoadingSignal<T>(
  loadingState: IValueLoadingState<T> | Subscribable<T> | Promise<T>,
  options?: LoadingSignalOptions
): LoadingSignal<T> {

  const injector = options?.injector;
  const needsInjector = !!options?.autoDispose;
  if (needsInjector && !injector) assertInInjectionContext(toLoadingSignal);

  let state: LoadingSignal<T>;

  if (loadingState instanceof ILoadingState) {
    state = fromLoadingState(loadingState);
  } else if (loadingState instanceof Promise) {
    state = fromPromise(loadingState);
  } else {
    state = fromObservable(loadingState);
  }

  if (options?.autoDispose) {
    const destroy = injector?.get(DestroyRef) ?? inject(DestroyRef);
    destroy.onDestroy(() => state.dispose());
  }

  return state;
}

function fromObservable<T>(value$: Subscribable<T>): LoadingSignal<T> {
  const value = signal<T | undefined>(undefined);
  const loading = signal(true);
  const error = signal<Error | undefined>(undefined);

  const sub = value$.subscribe({
    next: val => {
      sub.unsubscribe();
      loading.set(false);
      value.set(val);
    },
    error: err => {
      sub.unsubscribe();
      loading.set(false);
      error.set(parseError(err));
    },
    complete: () => {
      sub.unsubscribe();
      loading.set(false);
    }
  });

  return loadingSignal(value, {loading, error, dispose: () => sub.unsubscribe()});
}

function fromPromise<T>(promise: Promise<T>): LoadingSignal<T> {
  const value = signal<T | undefined>(undefined);
  const loading = signal(true);
  const error = signal<Error | undefined>(undefined);

  promise.then(val => value.set(val), err => error.set(parseError(err)));
  promise.finally(() => loading.set(false));

  return loadingSignal(value, {loading, error});
}

function fromLoadingState<T>(state: IValueLoadingState<T>): LoadingSignal<T> {
  const value = toSignal(state.result$, {manualCleanup: true});
  const loading = toSignal(state.loading$, {manualCleanup: true, initialValue: true});
  const error = toSignal(state.error$, {manualCleanup: true});
  return loadingSignal(value, {loading, error, dispose: () => state.cancel()});
}
