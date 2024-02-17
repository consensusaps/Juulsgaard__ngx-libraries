import {booleanAttribute, Directive, effect, ElementRef, inject, Injector, input, OnDestroy} from "@angular/core";
import {TemplateRendering} from "../models/template-rendering";

@Directive({selector: 'ngx-render', host: {'[style.display]': 'renderInside() ? "" : "hidden"'}})
export class RenderOutletDirective<T extends {}> implements OnDestroy {

  template = input<TemplateRendering<T>|undefined>(undefined, {alias: 'template'});
  renderInside = input(false, {transform: booleanAttribute});

  context = input<T>();
  autoDispose = input(false, {transform: booleanAttribute});

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private injector = inject(Injector);

  constructor() {
    effect(() => this.update());
  }

  ngOnDestroy() {
    if (this.autoDispose()) {
      this._template?.dispose();
      return;
    }

    this._template?.anchorRemoved(this.element);
  }

  _template?: TemplateRendering<T>;

  update() {
    const template = this.template();

    if (template == null) {
      this._template?.detach(this.element);
      this._template = undefined;
      return;
    }

    const inside = this.renderInside();
    const context = this.context();

    if (inside) {
      this._template?.attachInside(this.element, this.injector, context);
    } else {
      this._template?.attachAfter(this.element, this.injector, context);
    }

    this._template?.updateContext(context);
  }
}
