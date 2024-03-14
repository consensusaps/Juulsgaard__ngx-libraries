import {EmbeddedViewRef, Injector, TemplateRef, ViewContainerRef} from "@angular/core";
import {RenderSource} from "./render-source";
import {Observable, skip} from "rxjs";
import {latestValueFromOrDefault} from "@juulsgaard/rxjs-tools";
import {arrToSet, setToArr} from "@juulsgaard/ts-tools";

interface RenderingState {
  nodes: RenderNode[];
}

interface RenderNode {
  node: Node;
  anchor?: Element;
}

export abstract class TemplateRendering<T extends {} = {}> {

  private view?: EmbeddedViewRef<T>;
  private rendering?: RenderingState;
  private context?: T;

  /**
   * Render the Rendering
   * @param injector - Optionally override the injector used when rendering
   * @param context - The context for the template
   * @return view - Returns the ViewRef to the rendered template
   */
  protected abstract render(injector: Injector|undefined, context: T|undefined): EmbeddedViewRef<T>;

  /**
   * Get or create the ViewRef to the rendered template
   * @param injector - Optionally override the injector used when rendering
   * @return view - the ViewRef to the rendered template
   */
  private getView(injector: Injector | undefined): EmbeddedViewRef<T> {
    if (this.view) return this.view;
    this.view = this.render(injector, this.context);
    this.view.detectChanges();
    this.view.markForCheck();
    this.view.onDestroy(() => this.reset());
    return this.view;
  }

  private populateNodes(anchor: Element, injector: Injector | undefined, filter?: (node: Node) => boolean): Node[] {

    const view = this.getView(injector);
    this.rendering = {nodes: []};

    const nodes: Node[] = [];
    for (let node of view.rootNodes as Node[]) {
      if (!filter || filter(node)) {
        this.rendering.nodes.push({node, anchor});
        nodes.push(node);
        continue;
      }

      node.parentNode?.removeChild(node);
      this.rendering.nodes.push({node, anchor: undefined});
    }

    return nodes;
  }

  /**
   * Get the root nodes of the rendered template
   * @param anchor - The current anchor
   * @param injector - Optionally override the injector used when rendering
   * @param filter - Optional filter for which nodes to return
   * @return nodes - The root nodes of the rendered template
   */
  private getNodes(anchor: Element, injector: Injector | undefined, filter?: (node: Node) => boolean): Node[] {

    if (!this.rendering) return this.populateNodes(anchor, injector, filter);

    if (!filter) {
      this.rendering.nodes.forEach(x => x.anchor = anchor);
      return this.rendering.nodes.map(x => x.node);
    }

    // Get and update all matching nodes
    const nodes = arrToSet(this.rendering.nodes.filter(x => filter(x.node)));
    nodes.forEach(x => x.anchor = anchor);

    // Remove all non-matching nodes
    this.rendering.nodes
      .filter(x => !nodes.has(x))
      .filter(x => x.anchor == anchor)
      .forEach(node => {
        node.node.parentNode?.removeChild(node.node);
        node.anchor = undefined;
      });

    return setToArr(nodes, x => x.node);
  }

  /**
   * Render and attach this template after the anchor
   * @param anchor - The HTML Anchor
   * @param injector - A specific injector to use
   * @param context - Optionally define a starting context
   * @param filter - Optional filter for which nodes to attach
   */
  attachAfter(anchor: Element, injector: Injector|undefined, context?: T|null, filter?: (node: Node) => boolean) {
    this.setContext(context);
    const nodes = this.getNodes(anchor, injector, filter);
    anchor.after(...nodes);
  };

  /**
   * Render and attach this template inside the anchor
   * @param anchor - The HTML Anchor
   * @param injector - A specific injector to use
   * @param context - Optionally define a starting context
   * @param filter - Optional filter for which nodes to attach
   */
  attachInside(anchor: Element, injector: Injector|undefined, context?: T|null, filter?: (node: Node) => boolean) {
    this.setContext(context);
    const nodes = this.getNodes(anchor, injector, filter);
    anchor.append(...nodes);
  };

  /**
   * Coalesce and set the current context
   * @param context - undefined = don't change, null = clear
   * @return state - undefined = no change, null = cleared
   */
  protected setContext(context: T|null|undefined): T|null|undefined {

    if (context === undefined) return undefined;

    if (context === null) {
      if (this.context == null) return undefined;
      this.context = undefined;
      return null;
    }

    if (this.context === context) return undefined;
    this.context = context;
    return this.context;
  }

  /**
   * Send new data to the template
   * @param context - New template context
   */
  updateContext(context: T|null|undefined) {
    const ctx = this.setContext(context);
    if (ctx == null) return;

    if (!this.view) return;
    if (this.view.context === ctx) return;

    Object.assign(this.view.context, ctx);
    this.view.markForCheck();
  }

  /**
   * Stop rendering the template at this anchor.
   * This will not destroy the template, just stop rendering it
   * @param element - The anchor to remove the template from
   */
  detach(element: Element) {
    if (!this.rendering) return;

    this.rendering.nodes
      .filter(x => x.anchor === element)
      .forEach(node => {
        node.node.parentNode?.removeChild(node.node);
        node.anchor = undefined;
      });
  }

  /**
   * Notify the template that it's current anchor was destroyed
   * @param element - The anchor that was destroyed
   */
  anchorRemoved(element: Element) {
    this.rendering?.nodes
      .filter(x => x.anchor === element)
      .forEach(node => node.anchor = undefined);
  }

  /**
   * Fully destroy the template and stop rendering it
   */
  dispose() {
    this.view?.destroy();
  }

  detachChangeRef() {
    this.view?.detach();
  }

  private reset() {
    this.view = undefined;
    this.rendering = undefined;
  }
}

export class StaticTemplateRendering extends TemplateRendering {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<{}>
  ) {
    super();
  }

  protected render(injector: Injector|undefined): EmbeddedViewRef<{}> {
    return this.viewContainer.createEmbeddedView(this.template, {}, {injector});
  }

}

export class ConstantTemplateRendering<T extends {}> extends TemplateRendering<T> {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<T>,
    data: T
  ) {
    super();
    this.setContext(data);
  }

  protected render(injector: Injector|undefined, context: T|undefined): EmbeddedViewRef<T> {
    if (context == null) throw Error("Template cannot be rendered without a context");
    return this.viewContainer.createEmbeddedView(this.template, context, {injector});
  }

}

export class TypedTemplateRendering<T extends {}> extends TemplateRendering<T> {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<T>
  ) {
    super();
  }

  protected render(injector: Injector|undefined, context: T): EmbeddedViewRef<T> {
    if (context == null) throw Error("Template cannot be rendered without a context");
    return this.viewContainer.createEmbeddedView(this.template, context, {injector});
  }

}

export class ObservableTemplateRendering<T extends {}> extends TemplateRendering<T> {

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<T>,
    private readonly data$: Observable<T>
  ) {
    super();
  }

  protected render(injector: Injector|undefined, context: T|undefined): EmbeddedViewRef<T> {

    const latestContext = latestValueFromOrDefault(this.data$);
    if (latestContext != null) {
      this.setContext(latestContext);
      context = latestContext;
    }

    if (context == null) throw Error("Template cannot be rendered without a context");

    const view = this.viewContainer.createEmbeddedView(this.template, context, {injector});

    const sub = this.data$.pipe(
      skip(latestContext == null ? 0 : 1)
    ).subscribe(data => this.updateContext(data));

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
    template: TemplateRef<{}>|TemplateRef<void>
  ) {
    return new StaticTemplateRendering(viewContainer, template as TemplateRef<{}>);
  }

  /**
   * Create a rendering context for a template with static data
   * @param viewContainer - The contextual view container
   * @param template - The template accepting the static data
   * @param data - The static data
   * @constructor
   */
  export function Constant<T extends {}>(
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
  export function Typed<T extends {}>(
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
  export function Observable<T extends {}>(
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
    export function Constant<T extends {}>(source: RenderSource<T>, data: T) {
      return Rendering.Constant<T>(source.viewContainer, source.template, data);
    }

    /**
     * Create a rendering context for a render source with data
     * @param source - The render source
     * @constructor
     */
    export function Typed<T extends {}>(source: RenderSource<T>) {
      return Rendering.Typed<T>(source.viewContainer, source.template);
    }

    /**
     * Create a rendering context for a render source with data from an observable
     * @param source - The render source
     * @param data$ - The data observable
     * @constructor
     */
    export function Observable<T extends {}>(source: RenderSource<T>, data$: Observable<T>) {
      return Rendering.Observable<T>(source.viewContainer, source.template, data$);
    }

  }
}
