import {Injectable, TemplateRef, ViewContainerRef} from '@angular/core';
import {OverlayService} from "@juulsgaard/ngx-tools";
import {OverlayInstance} from "../models/overlay-instance";
import {OverlayOptions} from "../models/overlay-options";
import {ObservableStack} from "@juulsgaard/rxjs-tools";

@Injectable({providedIn: 'root'})
export class OverlayManagerService {

  private scheduler = new ObservableStack<OverlayInstance>();

  overlay$ = this.scheduler.topDelta$;

  constructor(private overlayService: OverlayService) {
  }

  createOverlay(
    viewContainer: ViewContainerRef,
    contentTemplate: TemplateRef<void>,
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

