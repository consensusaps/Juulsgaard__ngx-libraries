import {DecoratorContext} from "./decorator-context";
import {Disposable, KeysOfTypeOrNull} from "@consensus-labs/ts-tools";
import {Unsubscribable} from "rxjs";

export function Dispose<T extends object>(
  target: T,
  propertyKey: KeysOfTypeOrNull<T, Unsubscribable|Disposable>
): void {

  const context = new DecoratorContext<T>(target);

  context.onDestroy(instance => {

    const prop = instance[propertyKey] as Unsubscribable|Disposable|undefined;
    if (!prop) return;

    if ('unsubscribe' in prop && typeof prop.unsubscribe === 'function') {
      prop.unsubscribe();
      return;
    }

    if ('dispose' in prop && typeof prop.dispose === 'function') {
      prop.dispose();
      return;
    }
  });
}
