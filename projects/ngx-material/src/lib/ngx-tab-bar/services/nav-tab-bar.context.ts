import {Injectable} from "@angular/core";
import {BehaviorSubject, combineLatest, distinctUntilChanged, filter, Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {slugify} from "@consensus-labs/ts-tools";
import {cache} from "@consensus-labs/rxjs-tools";
import {INavTab} from "../models/nav-tab.interface";

@Injectable()
export abstract class NavTabBarContext {

  private readonly _tabs$ = new BehaviorSubject<INavTab[]>([]);
  readonly tabs$ = this._tabs$.asObservable();

  get tabs() {
    return this._tabs$.value
  }

  private readonly _active$ = new BehaviorSubject(true);
  readonly active$ = this._active$.asObservable();
  get active() {return this._active$.value}

  private readonly _slug$ = new BehaviorSubject<string | undefined>(undefined);
  readonly slug$: Observable<string>;

  tab$: Observable<INavTab | undefined>;

  protected constructor() {
    this.slug$ = this._slug$.pipe(
      filter((x): x is string => x !== undefined),
      map(slugify),
      startWith(''),
      distinctUntilChanged(),
      cache()
    );

    const tabs$ = this.tabs$.pipe(
      map(x => x.filter(t => !t.isHidden && !t.isDisabled))
    );

    this.tab$ = combineLatest([tabs$, this.slug$]).pipe(
      map(([tabs, slug]) => {
        if (!tabs.length) return undefined;
        return tabs.find(x => x.id == slug) ?? tabs[0];
      }),
      distinctUntilChanged(),
      cache()
    );
  }

  protected setActive(active: boolean) {
    this._active$.next(active);
  }

  protected setTabs(tabs: INavTab[]) {
    this._tabs$.next(tabs);
  }

  protected setSlug(slug: string|undefined) {
    this._slug$.next(slug);
  }

  abstract openTab(slug: string): void;
}
