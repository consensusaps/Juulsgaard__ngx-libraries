import {auditTime, BehaviorSubject, combineLatest, Observable, of, switchMap} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {cache, Future, FutureEmpty, FutureError, FutureLoading, FutureUnion, FutureValue, subscribed} from "@consensus-labs/rxjs-tools";

export class FutureSwitch<T> {

  private state$: Observable<FutureUnion<T>>;

  loading$: Observable<FutureSwitchLoading<T>|undefined>;
  loadingOverlay$: Observable<FutureSwitchLoading<T>|undefined>;
  emptyLoading$: Observable<FutureSwitchLoading<T>|undefined>;

  error$: Observable<FutureSwitchError<T>|undefined>;
  errorOverlay$: Observable<FutureSwitchError<T>|undefined>;
  emptyError$: Observable<FutureSwitchError<T>|undefined>;

  empty$: Observable<FutureSwitchEmpty|undefined>;

  data$: Observable<FutureSwitchValue<T>|undefined>;

  constructor(private future$: Observable<Future<T>|undefined>) {

    const defaultEmpty = new FutureEmpty();

    this.state$ = future$.pipe(
      switchMap(x => x?.state$ ?? of(defaultEmpty)),
      cache()
    );

    const hasLoading$ = new BehaviorSubject(false);
    const hasError$ = new BehaviorSubject(false);

    const hasEmpty$ = new BehaviorSubject(false);
    const hasEmptyLoading$ = new BehaviorSubject(false);
    const hasEmptyError$ = new BehaviorSubject(false);

    //<editor-fold desc="Loading">

    /**
     * Calculate the loading state
     * Has 2 fallbacks
     * First on unhandled empty states
     * Second on unhandled errors with no value
     */
    const loading$ = combineLatest([this.state$, hasError$, hasEmptyError$, hasEmpty$]).pipe(
      auditTime(0),
      map(([state, hasError, hasEmptyError, hasEmpty]) => {
        if (state instanceof FutureLoading) return state;

        // If empty state
        if (state instanceof FutureEmpty) {

          // If empty states aren't handled, emit as loading state
          if (!hasEmpty) return state;

          return undefined;
        }

        // If error state, but no value given
        if (state instanceof FutureError && state.value === undefined) {

          // If errors aren't handled, treat the state as an empty state
          if (!hasError && !hasEmptyError) {

            // If empty states aren't handled, emit as loading state
            if (!hasEmpty) return defaultEmpty;
          }
        }

        return undefined;
      }),
      distinctUntilChanged(),
      cache()
    );

    // Output when loading screens should be shown
    this.loading$ = combineLatest([loading$, hasEmptyLoading$]).pipe(
      auditTime(0),
      subscribed(hasLoading$),
      map(([state, hasEmptyLoading]) => {
        if (!state) return undefined;
        if (state instanceof FutureLoading && state.value) return state;
        // If state has no value and no-value loading screens are handled, then return undefined
        return hasEmptyLoading ? undefined : state;
      }),
      distinctUntilChanged(),
      cache()
    );

    // Output when loading overlays should be shown
    this.loadingOverlay$ = loading$;

    // Output when no-value loading screens should be shown
    this.emptyLoading$ = loading$.pipe(
      subscribed(hasEmptyLoading$),
      map(state => {
        if (!state) return undefined;
        // Filter out loading states with values
        if (state instanceof FutureLoading && state.value) return undefined;
        return state;
      }),
      distinctUntilChanged(),
      cache()
    );

    //</editor-fold>

    //<editor-fold desc="Error">

    const error$ = this.state$.pipe(
      map(x => x instanceof FutureError ? x : undefined),
      distinctUntilChanged(),
      cache()
    );

    // Output when error screens should be shown
    this.error$ = combineLatest([error$, hasEmptyError$]).pipe(
      auditTime(0),
      subscribed(hasError$),
      map(([state, hasEmptyError]) => {
        if (!state) return undefined;
        if (state.value) return state;
        // If state has no value and no-value error screens are handled, then return undefined
        return hasEmptyError ? undefined : state;
      }),
      distinctUntilChanged(),
      cache()
    );

    // Output when error overlays should be shown
    this.errorOverlay$ = error$;

    // Output when no-value error screens should be shown
    this.emptyError$ = error$.pipe(
      subscribed(hasEmptyError$),
      map(state => {
        if (!state) return undefined;
        if (state.value) return undefined;
        return state;
      }),
      distinctUntilChanged(),
      cache()
    );

    //</editor-fold>

    //<editor-fold desc="Empty">

    // Output when no-value screens should be shown
    this.empty$ = combineLatest([this.state$, hasLoading$, hasEmptyLoading$, hasError$, hasEmptyError$]).pipe(
      auditTime(0),
      subscribed(hasEmpty$),
      map(([state, hasLoading, hasEmptyLoading, hasError, hasEmptyError]) => {

        if (state instanceof FutureEmpty) return state;

        // Handle errors
        if (state instanceof FutureError) {
          // If error state has value, return undefined
          if (state.value) return undefined;
          // If error state is handled, return undefined
          if (hasError || hasEmptyError) return undefined;

          // emit an unhandled empty error state
          return state;
        }

        // Handle loading
        if (state instanceof FutureLoading) {
          // If loading state has value, return undefined
          if (state.value) return undefined;
          // If loading state is handled, return undefined
          if (hasLoading || hasEmptyLoading) return undefined;

          // emit an unhandled empty loading state
          return state;
        }

        return undefined;
      }),
      distinctUntilChanged(),
      cache()
    );
    //</editor-fold>

    //<editor-fold desc="Data">

    // Output when data screens should be shown
    this.data$ = combineLatest([this.state$, hasLoading$, hasError$]).pipe(
      auditTime(0),
      map(([state, hasLoading, hasError]) => {

        if (state instanceof FutureValue) return state;

        // If loading isn't handled, show data when a value is present
        if (!hasLoading && state instanceof FutureLoading && state.value !== undefined) {
          return new FutureValue<T>(state.value);
        }

        // If errors aren't handled, show data when a value is present
        if (!hasError && state instanceof FutureError && state.value !== undefined) {
          return new FutureValue<T>(state.value);
        }

        return undefined;
      }),
      distinctUntilChanged(),
      cache()
    );
    //</editor-fold>
  }
}

export type FutureSwitchLoading<T> = FutureLoading<T>|FutureEmpty;
export type FutureSwitchError<T> = FutureError<T>;
export type FutureSwitchValue<T> = FutureValue<T>;
export type FutureSwitchEmpty = FutureEmpty|FutureLoading<any>|FutureError<any>;
