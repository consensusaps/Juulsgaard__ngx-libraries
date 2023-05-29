import {
  ChangeDetectionStrategy, Component, forwardRef, Input, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";

@Component({
  selector: 'ngx-side-menu-tab',
  templateUrl: './side-menu-tab.component.html',
  styleUrls: ['./side-menu-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgxSideMenuTabContext, useExisting: forwardRef(() => SideMenuTabComponent)}]
})
export class SideMenuTabComponent extends NgxSideMenuTabContext {
  @Input({required: true}) id!: string;

  @Input('name') set nameData(name: string|undefined|null) {
    this._name$.next(name ?? undefined);
  };

  @Input('icon') set iconData(icon: string|undefined|null) {
    this._icon$.next(icon ?? undefined);
  };

  @Input('badge') set badgeData(badge: string|number|undefined|null) {
    if (typeof badge === 'number') {
      this._badge$.next(badge === 0 ? undefined : badge.toFixed(0));
      return;
    }

    this._badge$.next(badge ?? undefined);
  };

  constructor(readonly viewContainer: ViewContainerRef) {
    super();
  }

  @ViewChild('template', {static: true})
  readonly templateRef!: TemplateRef<void>;
}
