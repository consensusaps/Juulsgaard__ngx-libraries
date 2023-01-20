import {EmbeddedViewRef, Injector, TemplateRef, ViewContainerRef} from "@angular/core";
import {RenderSource} from "./render-source";
import {Observable, skip, take} from "rxjs";

interface RenderingState {
  nodes: Node[];
  anchor: Element;
}

export abstract class TemplateRendering<T = any> {

  private view?: EmbeddedViewRef<T>;
  private rendering?: RenderingState;
  protected context?: T;

  protected abstract render(injector?: Injector): EmbeddedViewRef<T>;

  private getView(injector: Injector | undefined): EmbeddedViewRef<T> {
    if (this.view) return this.view;
    this.view = this.render(injector);
    this.view.detectChanges();
    this.view.onDestroy(() => this.reset());
    return this.view;
  }

  private getNodes(anchor: Element, injector: Injector | undefined): Node[] {

    if (this.rendering?.anchor === anchor) {
      return this.rendering.nodes;
    }

    const view = this.getView(injector);
    this.rendering = {anchor, nodes: view.rootNodes};
    return this.rendering.nodes;
  }

  /**
   * Render and attach this template after the anchor
   * @param anchor - The HTML Anchor
   * @param injector - A specific injector to use
   * @param context - Optionally define a starting context
   */
  attachAfter(anchor: Element, injector?: Injector, context?: T) {
    if (context) this.context = context;
    const nodes = this.getNodes(anchor, injector);
    anchor.after(...nodes);
  };

  /**
   * Render and attach this template inside the anchor
   * @param anchor - The HTML Anchor
   * @param injector - A specific injector to use
   * @param context - Optionally define a starting context
   */
  attachInside(anchor: Element, injector?: Injector, context?: T) {
    if (context) this.context = context;
    const nodes = this.getNodes(anchor, injector);
    anchor.append(...nodes);
  };

  /**
   * Send new data to the template
   * @param context - New template context
   */
  updateContext(context?: T) {
    if (!context) return;
    this.context = context;
    if (!this.view) return;
    this.view.context = context;
    this.view.detectChanges();
  }

  /**
   * Stop rendering the template at this anchor.
   * This will not destroy the template, just stop rendering it
   * @param element - The anchor to remove the template from
   */
  detach(element: Element) {
    if (this.rendering && element !== this.rendering.anchor) return;

    this.rendering?.nodes.forEach(node => node.parentNode?.removeChild(node));
    this.rendering = undefined;
  }

  /**
   * Notify the template that it's current anchor was destroyed
   * @param element - The anchor that was destroyed
   */
  anchorRemoved(element: Element) {
    if (this.rendering && element !== this.rendering.anchor) return;
    this.rendering = undefined;
  }

  /**
   * Fully destroy the template and stop rendering it
   */
  dispose() {
    this.view?.destroy();
  }

  private reset() {
    this.view = undefined;
    this.rendering = undefined;
  }
}

export class StaticTemplateRendering extends TemplateRendering<void> {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<void>
  ) {
    super();
  }

  protected render(injector?: Injector): EmbeddedViewRef<void> {
    return this.viewContainer.createEmbeddedView(this.template, undefined, {injector});
  }

}

export class ConstantTemplateRendering<T> extends TemplateRendering<T> {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<T>,
    private readonly data: T
  ) {
    super();
    this.context = data;
  }

  protected render(injector?: Injector): EmbeddedViewRef<T> {
    return this.viewContainer.createEmbeddedView(this.template, this.context, {injector});
  }

}

export class TypedTemplateRendering<T> extends TemplateRendering<T> {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<T>
  ) {
    super();
  }

  protected render(injector?: Injector): EmbeddedViewRef<T> {
    return this.viewContainer.createEmbeddedView(this.template, this.context, {injector});
  }

}

export class ObservableTemplateRendering<T> extends TemplateRendering<T> {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<T>,
    private readonly data$: Observable<T>
  ) {
    super();
  }

  protected render(injector?: Injector): EmbeddedViewRef<T> {

    let hasValue = false;
    this.data$.pipe(take(1)).subscribe(data => {
      hasValue = true;
      this.context = data;
    }).unsubscribe();

    const view = this.viewContainer.createEmbeddedView(this.template, this.context, {injector});

    const sub = this.data$.pipe(skip(hasValue ? 1 : 0)).subscribe(data => this.updateContext(data));
    view.onDestroy(() => sub.unsubscribe());

    return view;
  }
}

export module Rendering {
  export function Static(
    viewContainer: ViewContainerRef,
    template: TemplateRef<void>
  ) {
    return new StaticTemplateRendering(viewContainer, template);
  }

  export function Constant<T>(
    viewContainer: ViewContainerRef,
    template: TemplateRef<T>,
    data: T
  ) {
    return new ConstantTemplateRendering(viewContainer, template, data);
  }

  export function Typed<T>(
    viewContainer: ViewContainerRef,
    template: TemplateRef<T>
  ) {
    return new TypedTemplateRendering(viewContainer, template);
  }

  export function Observable<T>(
    viewContainer: ViewContainerRef,
    template: TemplateRef<T>,
    data$: Observable<T>
  ) {
    return new ObservableTemplateRendering(viewContainer, template, data$);
  }

  export module FromSource {

    export function Static(source: RenderSource) {
      return Rendering.Static(source.viewContainer, source.template);
    }

    export function Constant<T>(source: RenderSource<T>, data: T) {
      return Rendering.Constant<T>(source.viewContainer, source.template, data);
    }

    export function Typed<T>(source: RenderSource<T>) {
      return Rendering.Typed<T>(source.viewContainer, source.template);
    }

    export function Observable<T>(source: RenderSource<T>, data$: Observable<T>) {
      return Rendering.Observable<T>(source.viewContainer, source.template, data$);
    }

  }
}
