import {BehaviorSubject, merge, Observable, skip} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {inject, TemplateRef, ViewContainerRef} from "@angular/core";
import {NgxSideMenuContext} from "./menu-context";
import {ThemePalette} from "@angular/material/core";

export abstract class NgxSideMenuTabContext {

  abstract id: string;

  protected _name$ = new BehaviorSubject<string|undefined>(undefined);
  readonly name$ = this._name$.asObservable();
  get name() {return this._name$.value}

  protected _icon$ = new BehaviorSubject<string|undefined>(undefined);
  readonly icon$ = this._icon$.asObservable();
  get icon() {return this._icon$.value}

  protected _badge$ = new BehaviorSubject<string|undefined>(undefined);
  readonly badge$ = this._badge$.asObservable();
  get badge() {return this._badge$.value}

  protected _badgeColor$ = new BehaviorSubject<ThemePalette|undefined>(undefined);
  readonly badgeColor$ = this._badgeColor$.asObservable();
  get badgeColor() {return this._badgeColor$.value}

  abstract readonly templateRef: TemplateRef<void>;
  abstract readonly viewContainer: ViewContainerRef;

  isOpen$: Observable<boolean>;

  protected _disabled$ = new BehaviorSubject(false);
  isDisabled$ = this._disabled$.pipe(distinctUntilChanged());
  get isDisabled() {return this._disabled$.value}

  protected _hidden$ = new BehaviorSubject(false);
  isHidden$ = this._hidden$.pipe(distinctUntilChanged());
  get isHidden() {return this._hidden$.value}

  changes$: Observable<void>;

  private context = inject(NgxSideMenuContext);

  protected constructor() {

    this.isOpen$ = this.context.tab$.pipe(
      map(x => x === this),
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
