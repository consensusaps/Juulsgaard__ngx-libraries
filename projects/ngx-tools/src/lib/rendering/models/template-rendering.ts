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

  /**
   * Render the Rendering
   * @param injector - Optionally override the injector used when rendering
   * @return view - Returns the ViewRef to the rendered template
   */
  protected abstract render(injector?: Injector): EmbeddedViewRef<T>;

  /**
   * Get or create the ViewRef to the rendered template
   * @param injector - Optionally override the injector used when rendering
   * @return view - the ViewRef to the rendered template
   */
  private getView(injector: Injector | undefined): EmbeddedViewRef<T> {
    if (this.view) return this.view;
    this.view = this.render(injector);
    this.view.detectChanges();
    this.view.onDestroy(() => this.reset());
    return this.view;
  }

  /**
   * Get the root nodes of the rendered template
   * @param anchor - The current anchor
   * @param injector - Optionally override the injector used when rendering
   * @return nodes - The root nodes of the rendered template
   */
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
    if (this.view.context === context) return;
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
    data: T
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

  /**
   * Create a rendering context for a template with no data
   * @param viewContainer - The contextual view container
   * @param template - The static template
   * @constructor
   */
  export function Static(
    viewContainer: ViewContainerRef,
    template: TemplateRef<void>
  ) {
    return new StaticTemplateRendering(viewContainer, template);
  }

  /**
   * Create a rendering context for a template with static data
   * @param viewContainer - The contextual view container
   * @param template - The template accepting the static data
   * @param data - The static data
   * @constructor
   */
  export function Constant<T>(
    viewContainer: ViewContainerRef,
    template: TemplateRef<T>,
    data: T
  ) {
    return new ConstantTemplateRendering(viewContainer, template, data);
  }

  /**
   * Create a rendering context for a template with data
   * @param viewContainer - The contextual view container
   * @param template - The typed template
   * @constructor
   */
  export function Typed<T>(
    viewContainer: ViewContainerRef,
    template: TemplateRef<T>
  ) {
    return new TypedTemplateRendering(viewContainer, template);
  }

  /**
   * Create a rendering context for a template with data from an observable
   * @param viewContainer - The contextual view container
   * @param template - The template rendering the data
   * @param data$ - The data observable
   * @constructor
   */
  export function Observable<T>(
    viewContainer: ViewContainerRef,
    template: TemplateRef<T>,
    data$: Observable<T>
  ) {
    return new ObservableTemplateRendering(viewContainer, template, data$);
  }

  export module FromSource {

    /**
     * Create a rendering context for a render source with no data
     * @param source - The render source
     * @constructor
     */
    export function Static(source: RenderSource) {
      return Rendering.Static(source.viewContainer, source.template);
    }

    /**
     * Create a rendering context for a render source with static data
     * @param source - The render source
     * @param data - The static data
     * @constructor
     */
    export function Constant<T>(source: RenderSource<T>, data: T) {
      return Rendering.Constant<T>(source.viewContainer, source.template, data);
    }

    /**
     * Create a rendering context for a render source with data
     * @param source - The render source
     * @constructor
     */
    export function Typed<T>(source: RenderSource<T>) {
      return Rendering.Typed<T>(source.viewContainer, source.template);
    }

    /**
     * Create a rendering context for a render source with data from an observable
     * @param source - The render source
     * @param data$ - The data observable
     * @constructor
     */
    export function Observable<T>(source: RenderSource<T>, data$: Observable<T>) {
      return Rendering.Observable<T>(source.viewContainer, source.template, data$);
    }

  }
}
