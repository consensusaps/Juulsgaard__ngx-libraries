import {Subject} from "rxjs";
import {OverlayToken, Rendering, RenderSource, TemplateRendering} from "@juulsgaard/ngx-tools";
import {computed, Injector, Signal} from "@angular/core";
import {Disposable} from "@juulsgaard/ts-tools";

export interface TemplateDialogOptions {
  content: Signal<RenderSource>,
  footer: Signal<RenderSource | undefined>,
  header: Signal<string|undefined>;
  scrollable: Signal<boolean>;
  canClose: Signal<boolean>;
  type: Signal<string>;
  styles: Signal<string[]>;
}

export abstract class TemplateDialogContext {

  header: Signal<string|undefined>;
  scrollable: Signal<boolean>;
  canClose: Signal<boolean>;
  type: Signal<string>;
  styles: Signal<string[]>;

  abstract content: Signal<TemplateRendering>;
  abstract footer: Signal<TemplateRendering | undefined>;

  protected constructor(options: TemplateDialogOptions, public zIndex: number) {
    this.header = options.header;
    this.scrollable = options.scrollable;
    this.canClose = options.canClose;
    this.type = options.type;
    this.styles = options.styles;
  }

  abstract close(): void;
}

export class TemplateDialogInstance extends TemplateDialogContext implements Disposable {

  private _content?: TemplateRendering;
  readonly content: Signal<TemplateRendering>;
  private _footer?: TemplateRendering;
  readonly footer: Signal<TemplateRendering | undefined>;

  private _close$ = new Subject<void>();
  readonly close$ = this._close$.asObservable();

  constructor(
    private token: OverlayToken,
    options: TemplateDialogOptions,
    public readonly injector?: Injector,
  ) {
    super(options, token.zIndex);
    this.token.escape$.subscribe(() => this.close());

    this.content = computed(() => {
      this._content?.dispose();
      const source = options.content();
      this._content = Rendering.FromSource.Static(source);
      return this._content;
    });

    this.footer = computed(() => {
      this._footer?.dispose();
      const source = options.footer();
      this._footer = source && Rendering.FromSource.Static(source);
      return this._footer;
    });
  }

  dispose() {
    this.token.dispose();
    this._close$.complete();

    this._content?.detachChangeRef();
    this._footer?.detachChangeRef();

    // Delay until after animation ends
    setTimeout(() => {
      this._content?.dispose();
      this._footer?.dispose();
    }, 400);
  }

  close(): void {
    this._close$.next();
  }

}
