import {
  AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Injector, Input,
  OnDestroy, Output, QueryList
} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {map} from "rxjs/operators";
import {auditTime, distinctUntilChanged, merge, startWith, Subscription, switchMap} from "rxjs";
import {cache} from "@consensus-labs/rxjs-tools";
import {NgxSideMenuContext} from "../../models/menu-context";
import {isBool} from "@consensus-labs/ts-tools";
import {SideMenuManagerService} from "../../services/side-menu-manager.service";
import {SideMenuInstance} from "../../models/side-menu-instance";

@Component({
  selector: 'ngx-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgxSideMenuContext, useExisting: forwardRef(() => SideMenuComponent)}]
})
export class SideMenuComponent extends NgxSideMenuContext implements AfterContentInit, OnDestroy {

  @ContentChildren(NgxSideMenuTabContext, {descendants: false})
  private children?: QueryList<NgxSideMenuTabContext>;

  @Input({alias: 'show'}) set showData(show: string|boolean|undefined) {
    this.setShow(show);
  }
  @Output() showChange = new EventEmitter<string|boolean|undefined>();

  @Input() set buttons(show: boolean) {
    this.setShowButtons(show);
  }

  sub = new Subscription();
  instance?: SideMenuInstance;

  constructor(private menuManager: SideMenuManagerService, private injector: Injector) {
    super();
  }

  ngAfterContentInit() {
    if (!this.children) return;

    const children$ = this.children.changes.pipe(
      map(() => this.children?.toArray() ?? []),
      startWith(this.children.toArray()),
      cache()
    );

    // Re-run the logic every time the tabs change
    this.sub.add(children$.subscribe(x => this.setTabs(x)));

    // Re-run logic if any of the tabs change state
    const childChanges$ = children$.pipe(
      switchMap(children => merge(...children.map(x => x.changes$))),
      auditTime(0)
    );

    this.sub.add(childChanges$.subscribe(
      () => this.setTabs(this.children?.toArray() ?? [])
    ));

    const hasTab$ = this.tab$.pipe(
      map(x => !!x),
      distinctUntilChanged()
    );

    this.sub.add(hasTab$.subscribe(show => {
      if (!show) {
        if (this.instance) this.menuManager.closeMenu(this.instance);
      } else {
        this.instance = this.menuManager.createMenu(this, {}, this.injector);
      }
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleTab(tab: NgxSideMenuTabContext) {
    if (isBool(this.show)) {
      const val = !this.show;
      this.setShow(val);
      this.showChange.emit(val);
      return;
    }

    const val = this.show === tab.id ? undefined : tab.id;
    this.setShow(val);
    this.showChange.emit(val);
  }

  override openTab(slug: string) {
    if (isBool(this.show)) {
      this.setShow(true);
      this.showChange.emit(true);
      return;
    }

    this.setShow(slug);
    this.showChange.emit(slug);
  }

  override close() {
    if (isBool(this.show)) {
      this.setShow(false);
      this.showChange.emit(false);
      return;
    }

    this.setShow(undefined);
    this.showChange.emit(undefined);
  }
}
