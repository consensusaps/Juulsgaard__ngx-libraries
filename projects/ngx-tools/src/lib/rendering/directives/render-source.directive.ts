import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {RenderSource} from "../models/render-source";

@Directive({selector: '[ngxSource]'})
export class RenderSourceDirective<T extends {} = {}> implements RenderSource<T> {
  constructor(
    public readonly template: TemplateRef<T>,
    public readonly viewContainer: ViewContainerRef
  ) { }
}

