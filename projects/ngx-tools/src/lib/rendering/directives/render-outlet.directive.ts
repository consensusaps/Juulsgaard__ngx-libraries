import {
  booleanAttribute, Directive, effect, ElementRef, inject, Injector, input, InputSignal, InputSignalWithTransform,
  OnDestroy, signal, Signal, untracked
} from "@angular/core";
import {TemplateRendering} from "../models/template-rendering";

@Directive()
export abstract class BaseRenderDirective<T extends {}> implements OnDestroy {
  abstract template: Signal<TemplateRendering<T> | undefined>;
  abstract renderInside: Signal<boolean>;
  abstract context: Signal<T | undefined>;
  abstract autoDispose: Signal<boolean>;
  abstract filter: Signal<((node: Node) => boolean)|undefined>;

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

    this._template = template;
    const inside = this.renderInside();
    const context = this.context();
    const filter = this.filter()

    untracked(() => {
      if (inside) {
        template.attachInside(this.element, this.injector, context, filter);
      } else {
        template.attachAfter(this.element, this.injector, context, filter);
      }

      template.updateContext(context);
    });
  }
}

@Directive({selector: 'ngx-render', host: {'[style.display]': 'renderInside() ? "" : "hidden"'}})
export class RenderOutletDirective<T extends {}> extends BaseRenderDirective<T> {

  readonly template: InputSignal<TemplateRendering<T> | undefined> = input<TemplateRendering<T>>();
  readonly renderInside: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly context: InputSignal<T | undefined> = input<T>();
  readonly autoDispose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly filter: InputSignal<((node: Node) => boolean) | undefined> = input<(node: Node) => boolean>();
}

@Directive({selector: '[ngxRender]'})
export class TemplateRenderDirective<T extends {}> extends BaseRenderDirective<T> {

  readonly template: InputSignal<TemplateRendering<T> | undefined> = input<TemplateRendering<T>|undefined>(undefined, {alias: 'ngxRender'});
  readonly context: InputSignal<T | undefined> = input<T>();

  readonly autoDispose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly renderInside = signal(true);

  readonly filter: InputSignal<((node: Node) => boolean) | undefined> = input<(node: Node) => boolean>();
}
