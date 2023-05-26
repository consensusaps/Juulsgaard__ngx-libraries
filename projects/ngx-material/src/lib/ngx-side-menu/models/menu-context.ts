import {BehaviorSubject, combineLatest, distinctUntilChanged, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {isBool, slugify} from "@consensus-labs/ts-tools";
import {cache, filterList} from "@consensus-labs/rxjs-tools";
import {NgxSideMenuTabContext} from "./menu-tab-context";

export abstract class NgxSideMenuContext {

  private readonly _tabs$ = new BehaviorSubject<NgxSideMenuTabContext[]>([]);
  readonly tabs$ = this._tabs$.asObservable();

  private readonly _showButtons$ = new BehaviorSubject(false);
  readonly showButtons$ = this._showButtons$.asObservable();

  get tabs() {
    return this._tabs$.value
  }

  private readonly _show$ = new BehaviorSubject<string | boolean | undefined>(undefined);
  show$: Observable<string|boolean>;

  get show() {
    return this._show$.value;
  }

  tab$: Observable<NgxSideMenuTabContext | undefined>;

  protected constructor() {
    this.show$ = this._show$.pipe(
      map(x => {
        if (!x) return false;
        if (isBool(x)) return x;
        return slugify(x);
      }),
      distinctUntilChanged(),
      cache()
    );

    const tabs$ = this.tabs$.pipe(
      filterList(x => !x.isDisabled && !x.isHidden)
    );

    this.tab$ = combineLatest([tabs$, this.show$]).pipe(
      map(([tabs, show]) => {
        if (!show) return undefined;
        if (!tabs.length) return undefined;
        if (show === true) return tabs[0];
        return tabs.find(x => x.id == show) ?? tabs[0];
      }),
      distinctUntilChanged(),
      cache()
    );
  }

  protected setTabs(tabs: NgxSideMenuTabContext[]) {
    this._tabs$.next(tabs);
  }

  protected setShow(slug: string|boolean|undefined) {
    this._show$.next(slug);
  }

  protected setShowButtons(slug: boolean) {
    this._showButtons$.next(slug);
  }

  abstract openTab(slug: string): void;
  abstract close(): void;
  abstract toggleTab(tab: NgxSideMenuTabContext): void;
}
