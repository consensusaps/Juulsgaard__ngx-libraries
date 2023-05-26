import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';
import {SIDE_MENU_ANIMATE_IN} from "../../models/menu-tokens";
import {sideMenuAnimation} from "@consensus-labs/ngx-tools";
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {Observable} from "rxjs";
import {RenderTab} from "../../models/render-tab";
import {SideMenuRenderContext} from "../../models/side-menu-render-context";

@Component({
  templateUrl: './render-side-menu.component.html',
  styleUrls: ['./render-side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sideMenuAnimation()],
  host: {'[@sideMenu]': 'animate', '[class.ngx-side-menu]': 'true'}
})
export class RenderSideMenuComponent {

  animate = inject(SIDE_MENU_ANIMATE_IN);

  readonly tab$: Observable<RenderTab|undefined>;
  readonly tabs$: Observable<NgxSideMenuTabContext[]>;
  readonly showButtons$: Observable<boolean>;

  constructor(
    element: ElementRef<HTMLElement>,
    private context: SideMenuRenderContext
  ) {
    element.nativeElement.style.zIndex = context.zIndex?.toFixed(0) ?? '';
    this.tab$ = context.tab$;
    this.tabs$ = context.tabs$;
    this.showButtons$ = context.showButtons$;
  }

  onClose() {
    this.context.close();
  }

  protected readonly close = close;

  toggleTab(tab: NgxSideMenuTabContext) {
    this.context.toggleTab(tab);
  }
}
