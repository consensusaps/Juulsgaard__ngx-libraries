import {ComponentRef, Directive, Injector, ViewContainerRef} from '@angular/core';
import {asapScheduler, auditTime} from "rxjs";
import {RenderSideMenuComponent} from "../components/render-side-menu/render-side-menu.component";
import {SideMenuManagerService} from "../services/side-menu-manager.service";
import {SideMenuInstance} from "../models/side-menu-instance";
import {SideMenuRenderContext} from "../models/side-menu-render-context";
import {SIDE_MENU_ANIMATE_IN} from "../models/menu-tokens";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: 'ngx-side-menu-outlet'
})
export class NgxSideMenuOutletDirective {

  private component?: ComponentRef<RenderSideMenuComponent>;

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: SideMenuManagerService
  ) {
    this.manager.menu$.pipe(
      auditTime(0, asapScheduler),
      takeUntilDestroyed()
    ).subscribe(x => this.renderMenu(x.item, x.added));
  }

  renderMenu(instance: SideMenuInstance | undefined, added: boolean) {

    if (this.component) {
      this.component.instance.animate = !instance || !added;
      this.component.changeDetectorRef.markForCheck();
      this.component.destroy();
      this.component = undefined;
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

    this.component.changeDetectorRef.detectChanges();
    this.component.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this.viewContainer.clear();
  }

}
