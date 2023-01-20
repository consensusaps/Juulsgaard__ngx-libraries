import {Injectable, Injector} from "@angular/core";
import {Scheduler} from "@consensus-labs/rxjs-tools";
import {Observable} from "rxjs";
import {DialogInstance} from "../models/dialog-context";
import {OverlayService, RenderSource} from "@consensus-labs/ngx-tools";
import {TemplateDialogInstance, TemplateDialogOptions} from "../models/template-dialog-context";
import {StaticDialogInstance, StaticDialogOptions} from "../models/static-dialog-context";

@Injectable({providedIn: 'root'})
export class DialogManagerService {

  scheduler = new Scheduler<DialogInstance>();

  dialog$ = this.scheduler.frontChanges$;

  constructor(private overlayService: OverlayService) {

  }

  createDialog(
    injector: Injector|undefined,
    contentTemplate: Observable<RenderSource>|RenderSource,
    footerTemplate: Observable<RenderSource|undefined>|RenderSource|undefined,
    options: TemplateDialogOptions,
  ): TemplateDialogInstance {
    const token = this.overlayService.pushOverlay();
    const instance = new TemplateDialogInstance(
      token,
      options,
      contentTemplate,
      footerTemplate,
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
