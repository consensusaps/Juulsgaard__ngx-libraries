import {EmbeddedViewRef, Injector, TemplateRef, ViewContainerRef} from "@angular/core";

interface Rendering {
  nodes: Node[];
  anchor: Element;
}

export abstract class TemplateRendering {

  private view?: EmbeddedViewRef<void>;
  private rendering?: Rendering;

  protected abstract render(injector?: Injector): EmbeddedViewRef<void>;

  private getView(injector: Injector | undefined): EmbeddedViewRef<void> {
    if (this.view) return this.view;
    this.view = this.render(injector);
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
   */
  attachAfter(anchor: Element, injector?: Injector) {
    const nodes = this.getNodes(anchor, injector);
    anchor.after(...nodes);
  };

  /**
   * Render and attach this template inside the anchor
   * @param anchor - The HTML Anchor
   * @param injector - A specific injector to use
   */
  attachInside(anchor: Element, injector?: Injector) {
    const nodes = this.getNodes(anchor, injector);
    anchor.append(...nodes);
  };

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

export class SimpleTemplateRendering extends TemplateRendering {

  constructor(
    protected viewContainer: ViewContainerRef,
    protected template: TemplateRef<void>
  ) {
    super();
  }

  protected render(injector?: Injector): EmbeddedViewRef<void> {
    return this.viewContainer.createEmbeddedView(
      this.template,
      undefined,
      {injector: injector}
    );
  }

}
