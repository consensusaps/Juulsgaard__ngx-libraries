import {Injectable} from '@angular/core';
import {Scheduler} from "@consensus-labs/rxjs-tools";
import {OverlayContext} from "../models/overlay-context.models";
import {OverlayService, OverlayToken} from "@consensus-labs/ngx-tools";

@Injectable({providedIn: 'root'})
export class OverlayManagerService {

  private scheduler = new Scheduler<OverlayInstance>();

  overlay$ = this.scheduler.frontChanges$;

  constructor(private overlayService: OverlayService) {
  }

  createOverlay(overlay: OverlayContext): OverlayInstance {
    const token = this.overlayService.pushOverlay();
    token.handleEscape(() => overlay.onClose?.());
    const instance = {context: overlay, token};
    this.scheduler.push(instance);
    return instance;
  }

  closeOverlay(instance: OverlayInstance) {
    instance.token.dispose();
    this.scheduler.removeItem(instance);
  }
}

export interface OverlayInstance {
  context: OverlayContext;
  token: OverlayToken;
}
