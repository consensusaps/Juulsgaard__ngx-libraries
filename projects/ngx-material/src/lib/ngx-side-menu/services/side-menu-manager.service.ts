import {Injectable, Injector} from '@angular/core';
import {Scheduler} from "@consensus-labs/rxjs-tools";
import {OverlayService} from "@consensus-labs/ngx-tools";
import {NgxSideMenuContext} from "../models/menu-context";
import {SideMenuOptions} from "../models/side-menu-options";
import {SideMenuInstance} from "../models/side-menu-instance";

@Injectable({providedIn: "root"})
export class SideMenuManagerService {

  private scheduler = new Scheduler<SideMenuInstance>();

  menu$ = this.scheduler.frontChanges$;

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


