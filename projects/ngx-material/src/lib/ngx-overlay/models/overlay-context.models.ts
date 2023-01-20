import {TemplateRef, ViewContainerRef} from "@angular/core";
import {Observable} from "rxjs";
import {OverlayToken, Rendering, TemplateRendering} from "@consensus-labs/ngx-tools";


export interface OverlayOptions {
  canClose$: Observable<boolean>;
  scrollable$: Observable<boolean>;
  maxWidth$: Observable<number|undefined>;
}

export abstract class OverlayContext implements OverlayOptions {

  canClose$: Observable<boolean>;
  maxWidth$: Observable<number | undefined>;
  scrollable$: Observable<boolean>;

  abstract content: TemplateRendering;

  protected constructor(options: OverlayOptions, public zIndex: number) {
    this.canClose$ = options.canClose$;
    this.maxWidth$ = options.maxWidth$;
    this.scrollable$ = options.scrollable$;
  }

  abstract close(): void;
}

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
