import {effect, Injector, Signal, signal} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {Disposable} from "@juulsgaard/ts-tools";


/**
 * A simple conversion of Behaviour Subject to signal.
 * This will not handle unsubscription, and should only be used when the subject itself is closed / unloaded properly.
 * @param subject
 */
export function subjectToSignal<T>(subject: BehaviorSubject<T>): Signal<T>;
/**
 * A simple conversion of Subject to signal.
 * This will not handle unsubscription, and should only be used when the subject itself is closed / unloaded properly.
 * @param subject
 * @param initial - An initial value for the signal.
 */
export function subjectToSignal<T>(subject: Subject<T>, initial: T): Signal<T>;
export function subjectToSignal<T>(subject: Subject<T>, initial?: T): Signal<T> {
  const init = subject instanceof BehaviorSubject ? subject.value : initial!;
  const sig = signal(init);
  subject.subscribe(val => sig.set(val));
  return sig;
}

/**
 * Create an effect that disposes of old values when a new one is emitted.
 * It will also dispose the last value on destroy
 * @param signal - The signal to monitor
 * @param injector - An optional injector for when used outside constructor context
 */
export function handleDisposableSignal(signal: Signal<Disposable|undefined>, injector?: Injector) {
  let old: Disposable|undefined;
  effect((dispose) => {
    old?.dispose();
    old = signal();
    dispose(() => old?.dispose());
  }, {injector: injector});
}
