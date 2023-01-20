import {Observable, of, ReplaySubject, Subscription} from "rxjs";
import {AnyTemplate, OverlayToken, SimpleTemplateRendering, TemplateRendering} from "@consensus-labs/ngx-tools";
import {ViewContainerRef} from "@angular/core";

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

  get injector() {
    return this.viewContainer.injector
  }

  _content$ = new ReplaySubject<TemplateRendering>();
  content$ = this._content$.asObservable();
  _footer$ = new ReplaySubject<TemplateRendering | undefined>();
  footer$ = this._footer$.asObservable();

  private sub = new Subscription();
  private content?: TemplateRendering;
  private footer?: TemplateRendering;

  constructor(
    private viewContainer: ViewContainerRef,
    private token: OverlayToken,
    options: TemplateDialogOptions,
    contentTemplate: Observable<AnyTemplate> | AnyTemplate,
    footerTemplate?: Observable<AnyTemplate | undefined> | AnyTemplate,
  ) {
    super(options, token.zIndex);
    this.token.handleEscape(() => this.close());

    const content$ = contentTemplate instanceof Observable ? contentTemplate : of(contentTemplate);
    this.sub.add(content$.subscribe(template => {
      this.content?.dispose();
      this.content = new SimpleTemplateRendering(this.viewContainer, template);
      this._content$.next(this.content);
    }));

    if (!footerTemplate) return;

    const footer$ = footerTemplate instanceof Observable ? footerTemplate : of(footerTemplate);
    this.sub.add(footer$.subscribe(template => {
      this.content?.dispose();
      if (!template) return;
      this.content = new SimpleTemplateRendering(this.viewContainer, template);
      this._content$.next(this.content);
    }));
  }

  dispose() {
    this.token.dispose();
    this.sub.unsubscribe();
    this.content?.dispose();
    this.footer?.dispose();
  }

  private closeCallback?: () => any;

  onClose(callback: () => any) {
    this.closeCallback = callback;
  }

  close(): void {
    this.closeCallback?.();
  }

}
