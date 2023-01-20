import {TemplateDialogContext, TemplateDialogInstance} from "./template-dialog-context";
import {StaticDialogContext, StaticDialogInstance} from "./static-dialog-context";

export type DialogContext = TemplateDialogContext | StaticDialogContext;
export type DialogInstance = TemplateDialogInstance | StaticDialogInstance;
