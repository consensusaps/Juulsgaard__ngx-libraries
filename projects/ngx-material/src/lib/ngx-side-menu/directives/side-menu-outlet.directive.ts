import {ChangeDetectorRef, ComponentRef, Directive, Injector, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {RenderSideMenuComponent} from "../components/render-side-menu/render-side-menu.component";
import {SideMenuManagerService} from "../services/side-menu-manager.service";
import {SideMenuInstance} from "../models/side-menu-instance";
import {SideMenuRenderContext} from "../models/side-menu-render-context";
import {SIDE_MENU_ANIMATE_IN} from "../models/menu-tokens";

@Directive({
  selector: 'ngx-side-menu-outlet',
  standalone: true
})
export class NgxSideMenuOutletDirective {

  private sub?: Subscription;
  private component?: ComponentRef<RenderSideMenuComponent>;

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: SideMenuManagerService,
    private changes: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sub = this.manager.menu$.subscribe(x => this.renderMenu(x.item, x.added));
  }

  renderMenu(instance: SideMenuInstance | undefined, added: boolean) {

    if (this.component) {
      this.component.instance.animate = !instance || !added;
      this.component.changeDetectorRef.detectChanges();
      this.component.destroy();
    }

    if (!instance) return;

    const injector = Injector.create({
      parent: instance.injector ?? this.viewContainer.injector,
      providers: [
        {provide: SideMenuRenderContext, useValue: instance},
        {provide: SIDE_MENU_ANIMATE_IN, useValue: added}
      ],
      name: 'Side Menu Injector'
    });

    this.component = this.viewContainer.createComponent<RenderSideMenuComponent>(
      RenderSideMenuComponent,
      {injector: injector}
    );

    this.changes.detectChanges();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.viewContainer.clear();
  }

}
