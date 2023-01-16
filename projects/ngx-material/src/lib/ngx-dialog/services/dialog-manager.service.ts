import {Injectable} from "@angular/core";
import {Scheduler} from "@consensus-labs/rxjs-tools";
import {distinctUntilChanged} from "rxjs";
import {DialogContext, StaticDialogContext, TemplateDialogContext} from "../models/dialog-context.models";

@Injectable({providedIn: 'root'})
export class DialogManagerService {

  scheduler$ = new Scheduler<DialogContext>();

  dialog$ = this.scheduler$.front$.pipe(distinctUntilChanged());

  constructor() {

  }

  createStaticDialog(dialog: StaticDialogContext) {
    this.scheduler$.push(dialog);
  }

  createDialog(dialog: TemplateDialogContext) {
    this.scheduler$.push(dialog);
  }

  closeDialog(context: DialogContext) {
    this.scheduler$.removeItem(context);
  }
}
