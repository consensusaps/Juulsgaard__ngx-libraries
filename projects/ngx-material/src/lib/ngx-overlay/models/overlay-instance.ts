import {OverlayToken, Rendering} from "@consensus-labs/ngx-tools";
import {TemplateRef, ViewContainerRef} from "@angular/core";
import {OverlayOptions} from "./overlay-options";
import {OverlayContext} from "./overlay-context";

export class OverlayInstance extends OverlayContext {

  content = Rendering.Static(this.viewContainer, this.template);

  get injector() {
    return this.viewContainer.injector
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<void>,
    private token: OverlayToken,
    options: OverlayOptions
  ) {
    super(options, token.zIndex);
    this.token.handleEscape(() => this.close());
  }

  dispose() {
    this.token.dispose();

    // Delay until after animation ends
    setTimeout(() => this.content?.dispose(), 200);
  }

  private closeCallback?: () => any;

  onClose(callback: () => any) {
    this.closeCallback = callback;
  }

  close(): void {
    this.closeCallback?.();
  }

}
