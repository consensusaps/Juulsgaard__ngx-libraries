import {Signal, signal} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";


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
