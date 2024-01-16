import {
  booleanAttribute, Directive, ElementRef, Injector, Input, OnChanges, OnDestroy, SimpleChanges
} from "@angular/core";
import {TemplateRendering} from "../models/template-rendering";

@Directive({selector: 'ngx-render', host: {'[style.display]': 'renderInside ? "" : "hidden"'}})
export class RenderOutletDirective<T> implements OnChanges, OnDestroy {

  private template?: TemplateRendering<T>;
  @Input('template') _nextTemplate?: TemplateRendering<T>;
  @Input({transform: booleanAttribute}) renderInside = false;

  @Input() context?: T;
  @Input({transform: booleanAttribute}) autoDispose = false;

  constructor(
    private element: ElementRef<HTMLElement>,
    private injector: Injector
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['_nextTemplate']) {
      this.render(this._nextTemplate);
      return;
    }

    if (changes['context']) {
      this.template?.updateContext(this.context);
    }
  }

  ngOnDestroy() {
    if (this.autoDispose) {
      this.template?.dispose();
      return;
    }

    this.template?.anchorRemoved(this.element.nativeElement);
  }

  render(nextTemplate?: TemplateRendering) {
    this.template?.detach(this.element.nativeElement);
    this.template = nextTemplate;

    if (this.renderInside) {
      this.template?.attachInside(this.element.nativeElement, this.injector, this.context);
    } else {
      this.template?.attachAfter(this.element.nativeElement, this.injector, this.context);
    }
  }
}
