import {computed, ElementRef, forwardRef, inject, Injectable, Provider, signal, Signal, Type} from '@angular/core';
import {isFunction} from "@juulsgaard/ts-tools";

export interface IScrollContext {
  readonly element: HTMLElement|ElementRef<HTMLElement>;
  readonly scrollable: Signal<boolean>;
}

@Injectable({providedIn: 'root', useClass: forwardRef(() => RootScrollContext)})
export abstract class ScrollContext {

  static Provide(getComponent: (() => Type<IScrollContext>)|Type<IScrollContext>): Provider {
    return {provide: ScrollContext, useFactory: () => new ComponentScrollContext(getComponent)};
  }

  abstract scrollContainer: Signal<HTMLElement>;
}

export class ComponentScrollContext extends ScrollContext {

  component: IScrollContext;
  parent = inject(ScrollContext, {optional: true, skipSelf: true});
  readonly scrollContainer: Signal<HTMLElement>;

  constructor(getComponent: (() => Type<IScrollContext>)|Type<IScrollContext>) {
    super();
    const componentType = isFunction(getComponent) ? getComponent() : getComponent;
    this.component = inject(componentType);

    this.scrollContainer = computed(() => {

      if (this.component.scrollable()) {
        if (this.component.element instanceof ElementRef) return this.component.element.nativeElement;
        return this.component.element;
      }

      return this.parent?.scrollContainer() ?? document.body;
    });
  }
}

@Injectable()
export class RootScrollContext extends ScrollContext {
  scrollContainer = signal(document.body);
}
