import {ElementRef, forwardRef, inject, Injectable, Provider, Type} from '@angular/core';
import {isFunction} from "@juulsgaard/ts-tools";

export interface IScrollContext {
  readonly element: HTMLElement|ElementRef<HTMLElement>;
  readonly scrollable: boolean;
}

@Injectable({providedIn: 'root', useClass: forwardRef(() => RootScrollContext)})
export abstract class ScrollContext {

  static Provide(getComponent: (() => Type<IScrollContext>)|Type<IScrollContext>): Provider {
    return {provide: ScrollContext, useFactory: () => new ComponentScrollContext(getComponent)};
  }

  abstract getScrollContainer(): HTMLElement;
}

export class ComponentScrollContext extends ScrollContext {
  component: IScrollContext;
  parent = inject(ScrollContext, {optional: true, skipSelf: true});

  constructor(getComponent: (() => Type<IScrollContext>)|Type<IScrollContext>) {
    super();
    const componentType = isFunction(getComponent) ? getComponent() : getComponent;
    this.component = inject(componentType);
  }

  getScrollContainer(): HTMLElement {
    if (this.component.scrollable) {
      if (this.component.element instanceof ElementRef) return this.component.element.nativeElement;
      return this.component.element;
    }

    if (!this.parent) return document.body;

    return this.parent.getScrollContainer();
  }
}

@Injectable()
export class RootScrollContext extends ScrollContext {
  override getScrollContainer(): HTMLElement {
    return document.body;
  }
}
