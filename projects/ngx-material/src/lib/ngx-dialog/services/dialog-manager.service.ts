import {Injectable, Injector} from "@angular/core";
import {DialogInstance} from "../models/dialog-context";
import {OverlayService} from "@juulsgaard/ngx-tools";
import {TemplateDialogInstance, TemplateDialogOptions} from "../models/template-dialog-context";
import {StaticDialogInstance, StaticDialogOptions} from "../models/static-dialog-context";
import {ObservableStack} from "@juulsgaard/rxjs-tools";

@Injectable({providedIn: 'root'})
export class DialogManagerService {

  scheduler = new ObservableStack<DialogInstance>();

  dialog$ = this.scheduler.topDelta$;

  constructor(private overlayService: OverlayService) {

  }

  createDialog(options: TemplateDialogOptions, injector?: Injector): TemplateDialogInstance {
    const token = this.overlayService.pushOverlay();
    const instance = new TemplateDialogInstance(
      token,
      options,
      injector
    );
    this.scheduler.push(instance);
    return instance;
  }

  closeDialog(instance: DialogInstance) {
    instance.dispose();
    this.scheduler.removeItem(instance);
  }

  createStaticDialog(options: StaticDialogOptions, injector?: Injector) {
    const token = this.overlayService.pushOverlay();
    const instance = new StaticDialogInstance(
      token,
      options,
      injector,
    );
    this.scheduler.push(instance);
    return instance;
  }
}
