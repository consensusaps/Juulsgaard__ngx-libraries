import {TemplateRef, ViewContainerRef} from "@angular/core";

export interface RenderSource<T  extends {} = {}> {
  readonly template: TemplateRef<T>;
  readonly viewContainer: ViewContainerRef;
}
