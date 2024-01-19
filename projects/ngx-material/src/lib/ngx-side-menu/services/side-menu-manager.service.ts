import {Injectable, Injector} from '@angular/core';
import {OverlayService} from "@juulsgaard/ngx-tools";
import {NgxSideMenuContext} from "../models/menu-context";
import {SideMenuOptions} from "../models/side-menu-options";
import {SideMenuInstance} from "../models/side-menu-instance";
import {ObservableStack} from "@juulsgaard/rxjs-tools";

@Injectable({providedIn: "root"})
export class SideMenuManagerService {

  private scheduler = new ObservableStack<SideMenuInstance>();

  menu$ = this.scheduler.topDelta$;

  constructor(private overlayService: OverlayService) {
  }

  createMenu(
    context: NgxSideMenuContext,
    options: SideMenuOptions,
    injector?: Injector
  ): SideMenuInstance {
    const token = this.overlayService.pushOverlay();
    const instance = new SideMenuInstance(context, options, token, injector);
    this.scheduler.push(instance);
    return instance;
  }

  closeMenu(instance: SideMenuInstance) {
    instance.dispose();
    this.scheduler.removeItem(instance);
  }
}


