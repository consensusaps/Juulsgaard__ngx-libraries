import {
  booleanAttribute, Directive, effect, ElementRef, inject, Injector, input, InputSignal, InputSignalWithTransform,
  OnDestroy, signal, Signal
} from "@angular/core";
import {TemplateRendering} from "../models/template-rendering";

@Directive()
export abstract class BaseRenderDirective<T extends {}> implements OnDestroy {
  abstract template: Signal<TemplateRendering<T> | undefined>;
  abstract renderInside: Signal<boolean>;
  abstract context: Signal<T | undefined>;
  abstract autoDispose: Signal<boolean>;

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

@Directive({selector: 'ngx-render', host: {'[style.display]': 'renderInside() ? "" : "hidden"'}})
export class RenderOutletDirective<T extends {}> extends BaseRenderDirective<T> {

  template: InputSignal<TemplateRendering<T> | undefined> = input<TemplateRendering<T>>();
  renderInside: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  context: InputSignal<T | undefined> = input<T>();
  autoDispose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
}

@Directive({selector: '[ngxRender]'})
export class TemplateRenderDirective<T extends {}> extends BaseRenderDirective<T> {

  template: InputSignal<TemplateRendering<T> | undefined> = input<TemplateRendering<T>|undefined>(undefined, {alias: 'ngxRender'});
  context: InputSignal<T | undefined> = input<T>();
  autoDispose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  renderInside = signal(true);
}
