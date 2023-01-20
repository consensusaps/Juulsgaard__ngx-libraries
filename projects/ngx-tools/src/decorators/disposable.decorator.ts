import {DecoratorContext} from "./decorator-context";

export function Disposable(target: any, propertyKey: string): void {

  const context = new DecoratorContext(target);
  context.onDestroy(instance => {
    const prop = instance[propertyKey];
    if (!prop) return;

    if (typeof prop.unsubscribe === 'function') {
      prop.unsubscribe();
      return;
    }

    if (typeof prop.dispose === 'function') {
      prop.dispose();
      return;
    }
  });
}
