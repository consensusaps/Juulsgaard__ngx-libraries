import {Directive, ElementRef, Injector, Input, OnChanges, OnDestroy, SimpleChanges} from "@angular/core";
import {TemplateRendering} from "../models/template-rendering";

@Directive({selector: 'ngx-render', host: {'[style.display]': '"hidden"'}})
export class RenderOutletDirective implements OnChanges, OnDestroy {

  private template?: TemplateRendering;
  @Input('template') _nextTemplate?: TemplateRendering;
  @Input() inside?: boolean;

  constructor(
    private element: ElementRef<HTMLElement>,
    private injector: Injector
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['_nextTemplate']) {
      this.render(this._nextTemplate);
    }
  }

  ngOnDestroy() {
    this.template?.detach(this.element.nativeElement);
  }

  render(nextTemplate?: TemplateRendering) {
    this.template?.detach(this.element.nativeElement);
    this.template = nextTemplate;

    if (this.inside === true) {
      this.template?.attachInside(this.element.nativeElement, this.injector);
    } else {
      this.template?.attachAfter(this.element.nativeElement, this.injector);
    }
  }
}
