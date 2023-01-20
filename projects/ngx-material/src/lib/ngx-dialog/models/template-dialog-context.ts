import {Observable, of, ReplaySubject, Subscription} from "rxjs";
import {OverlayToken, Rendering, RenderSource, TemplateRendering} from "@consensus-labs/ngx-tools";
import {Injector} from "@angular/core";

export interface TemplateDialogOptions {
  header$: Observable<string>;
  withScroll$: Observable<boolean>;
}

export abstract class TemplateDialogContext implements TemplateDialogOptions {

  header$: Observable<string>;
  withScroll$: Observable<boolean>;
  abstract content$?: Observable<TemplateRendering>;
  abstract footer$?: Observable<TemplateRendering | undefined>;

  protected constructor(options: TemplateDialogOptions, public zIndex: number) {
    this.header$ = options.header$;
    this.withScroll$ = options.withScroll$;
  }

  abstract close(): void;
}

export class TemplateDialogInstance extends TemplateDialogContext {

  _content$ = new ReplaySubject<TemplateRendering>();
  content$ = this._content$.asObservable();
  _footer$ = new ReplaySubject<TemplateRendering | undefined>();
  footer$ = this._footer$.asObservable();

  private sub = new Subscription();
  private content?: TemplateRendering;
  private footer?: TemplateRendering;

  constructor(
    private token: OverlayToken,
    options: TemplateDialogOptions,
    contentTemplate: Observable<RenderSource> | RenderSource,
    footerTemplate?: Observable<RenderSource | undefined> | RenderSource,
    public readonly injector?: Injector,
  ) {
    super(options, token.zIndex);
    this.token.handleEscape(() => this.close());

    const content$ = contentTemplate instanceof Observable ? contentTemplate : of(contentTemplate);
    this.sub.add(content$.subscribe(source => {
      this.content?.dispose();
      this.content = Rendering.FromSource.Static(source);
      this._content$.next(this.content);
    }));

    if (!footerTemplate) return;

    const footer$ = footerTemplate instanceof Observable ? footerTemplate : of(footerTemplate);
    this.sub.add(footer$.subscribe(source => {
      this.footer?.dispose();
      if (!source) return;
      this.footer = Rendering.FromSource.Static(source);
      this._footer$.next(this.footer);
    }));
  }

  dispose() {
    this.token.dispose();
    this.sub.unsubscribe();

    // Delay until after animation ends
    setTimeout(() => {
      this.content?.dispose();
      this.footer?.dispose();
    }, 200);
  }

  private closeCallback?: () => any;

  onClose(callback: () => any) {
    this.closeCallback = callback;
  }

  close(): void {
    this.closeCallback?.();
  }

}
