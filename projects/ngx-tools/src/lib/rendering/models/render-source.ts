import {TemplateRef, ViewContainerRef} from "@angular/core";

export interface RenderSource<T = void> {
  readonly template: TemplateRef<T>;
  readonly viewContainer: ViewContainerRef;
}
