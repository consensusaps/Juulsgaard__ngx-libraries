import {
  AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Injector, Input,
  OnDestroy, Output, QueryList
} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {map} from "rxjs/operators";
import {auditTime, distinctUntilChanged, firstValueFrom, merge, startWith, Subscription, switchMap} from "rxjs";
import {cache} from "@consensus-labs/rxjs-tools";
import {NgxSideMenuContext} from "../../models/menu-context";
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

  @Input({alias: 'show'}) set showData(show: boolean) {
    this.setShow(show);
  }
  @Output() showChange = new EventEmitter<boolean>();

  @Input({alias: 'active'}) set activeData(show: string|undefined) {
    this.setShow(show);
  }
  @Output() activeChange = new EventEmitter<string|undefined>();

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
    if (this.instance) this.menuManager.closeMenu(this.instance);
  }

  private changeState(state: string|boolean|undefined) {
    this.setShow(state);
    this.showChange.emit(!!state);
    if (state === true) return;
    this.activeChange.emit(state === false ? undefined : state);
  }

  async toggleTab(tab: NgxSideMenuTabContext) {
    const activeTab = await firstValueFrom(this.tab$);
    this.changeState(tab === activeTab ? undefined : tab.id);
  }

  override openTab(slug: string) {
    this.changeState(slug);
  }

  override close() {
    this.changeState(false);
  }
}
