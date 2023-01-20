import {Injectable, ViewContainerRef} from '@angular/core';
import {Scheduler} from "@consensus-labs/rxjs-tools";
import {OverlayInstance, OverlayOptions} from "../models/overlay-context.models";
import {AnyTemplate, OverlayService} from "@consensus-labs/ngx-tools";

@Injectable({providedIn: 'root'})
export class OverlayManagerService {

  private scheduler = new Scheduler<OverlayInstance>();

  overlay$ = this.scheduler.frontChanges$;

  constructor(private overlayService: OverlayService) {
  }

  createOverlay(
    viewContainer: ViewContainerRef,
    contentTemplate: AnyTemplate,
    options: OverlayOptions
  ): OverlayInstance {
    const token = this.overlayService.pushOverlay();
    const instance = new OverlayInstance(viewContainer, contentTemplate, token, options);
    this.scheduler.push(instance);
    return instance;
  }

  closeOverlay(instance: OverlayInstance) {
    instance.dispose();
    this.scheduler.removeItem(instance);
  }
}

