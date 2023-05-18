import {Injectable} from '@angular/core';
import {BehaviorSubject, merge, Observable, of, skip, switchMap} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {INavTab} from "../models/nav-tab.interface";
import {NgxTabBarContext} from "./ngx-tab-bar.context";

@Injectable()
export abstract class NgxTabContext implements INavTab {

  abstract id: string;
  abstract name: string;

  isOpen$: Observable<boolean>;
  isActive$: Observable<boolean>;

  protected _disabled$ = new BehaviorSubject(false);
  isDisabled$ = this._disabled$.pipe(distinctUntilChanged());
  get isDisabled() {return this._disabled$.value}

  protected _hidden$ = new BehaviorSubject(false);
  isHidden$ = this._hidden$.pipe(distinctUntilChanged());
  get isHidden() {return this._hidden$.value}

  changes$: Observable<void>;

  protected constructor(private context: NgxTabBarContext) {

    this.isOpen$ = this.context.tab$.pipe(
      map(x => x === this),
      distinctUntilChanged(),
      cache()
    );

    this.isActive$ = this.context.active$.pipe(
      switchMap(active => active ? this.isOpen$ : of(false)),
      distinctUntilChanged(),
      cache()
    );

    this.changes$ = merge(
      this._hidden$.pipe(skip(1)), // Changes to hidden state
      this._disabled$.pipe(skip(1)), // Changes to disabled state
    ).pipe(map(() => undefined));
  }

  open() {
    this.context.openTab(this.id);
  }

  openTab(tab: string) {
    this.context.openTab(tab);
  }
}
