import {BehaviorSubject, merge, Observable, skip} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {cache} from "@consensus-labs/rxjs-tools";
import {inject, TemplateRef, ViewContainerRef} from "@angular/core";
import {NgxSideMenuContext} from "./menu-context";

export abstract class NgxSideMenuTabContext {

  abstract id: string;
  abstract name?: string;
  abstract icon?: string;
  abstract badge?: string;

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
