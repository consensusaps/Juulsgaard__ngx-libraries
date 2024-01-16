import {Observable, ReplaySubject, Subject, Subscription} from "rxjs";
import {OverlayToken, Rendering, RenderSource, TemplateRendering} from "@juulsgaard/ngx-tools";
import {Injector} from "@angular/core";
import {Disposable} from "@juulsgaard/ts-tools";

export interface TemplateDialogOptions {
  content$: Observable<RenderSource>,
  footer$: Observable<RenderSource | undefined>,
  header$: Observable<string>;
  scrollable$: Observable<boolean>;
  canClose$: Observable<boolean>;
  type$: Observable<string>;
  styles$: Observable<string[]>;
}

export abstract class TemplateDialogContext {

  header$: Observable<string>;
  scrollable$: Observable<boolean>;
  canClose$: Observable<boolean>;
  type$: Observable<string>;
  styles$: Observable<string[]>;

  abstract content$: Observable<TemplateRendering>;
  abstract footer$: Observable<TemplateRendering | undefined>;

  protected constructor(options: TemplateDialogOptions, public zIndex: number) {
    this.header$ = options.header$;
    this.scrollable$ = options.scrollable$;
    this.canClose$ = options.canClose$;
    this.type$ = options.type$;
    this.styles$ = options.styles$;
  }

  abstract close(): void;
}

export class TemplateDialogInstance extends TemplateDialogContext implements Disposable {

  private _content$ = new ReplaySubject<TemplateRendering>();
  readonly content$ = this._content$.asObservable();
  private _footer$ = new ReplaySubject<TemplateRendering | undefined>();
  readonly footer$ = this._footer$.asObservable();

  private _close$ = new Subject<void>();
  readonly close$ = this._close$.asObservable();

  private sub = new Subscription();
  private content?: TemplateRendering;
  private footer?: TemplateRendering;

  constructor(
    private token: OverlayToken,
    options: TemplateDialogOptions,
    public readonly injector?: Injector,
  ) {
    super(options, token.zIndex);
    this.token.escape$.subscribe(() => this.close());

    this.sub.add(options.content$.subscribe(source => {
      this.content?.dispose();
      this.content = Rendering.FromSource.Static(source);
      this._content$.next(this.content);
    }));

    this.sub.add(options.footer$.subscribe(source => {
      this.footer?.dispose();
      this.footer = source ? Rendering.FromSource.Static(source) : undefined;
      this._footer$.next(this.footer);
    }));
  }

  dispose() {
    this.sub.unsubscribe();
    this.token.dispose();
    this._close$.complete();

    // Delay until after animation ends
    setTimeout(() => {
      this.content?.dispose();
      this.footer?.dispose();
    }, 200);
  }

  close(): void {
    this._close$.next();
  }

}
