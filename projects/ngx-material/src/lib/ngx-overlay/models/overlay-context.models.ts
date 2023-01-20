import {ViewContainerRef} from "@angular/core";
import {Observable} from "rxjs";
import {AnyTemplate, OverlayToken, SimpleTemplateRendering, TemplateRendering} from "@consensus-labs/ngx-tools";


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

  content = new SimpleTemplateRendering(this.viewContainer, this.template);

  get injector() {
    return this.viewContainer.injector
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private template: AnyTemplate,
    private token: OverlayToken,
    options: OverlayOptions
  ) {
    super(options, token.zIndex);
    this.token.handleEscape(() => this.close());
  }

  dispose() {
    this.token.dispose();
    this.content.dispose();
  }

  private closeCallback?: () => any;

  onClose(callback: () => any) {
    this.closeCallback = callback;
  }

  close(): void {
    this.closeCallback?.();
  }

}
