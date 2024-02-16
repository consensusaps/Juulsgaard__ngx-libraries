import {Directive, effect, EmbeddedViewRef, input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({selector: '[ngxLet]', standalone: true})
export class NgxLetDirective<T> {

  value = input.required<T>({alias: 'ngxLet'});

  private view?: EmbeddedViewRef<TemplateContext<T>>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    effect(() => {
      if (!this.view) {
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxLet: this.value()});
        this.view.markForCheck();
      } else {
        this.view.context = {ngxLet: this.value()};
        this.view.markForCheck();
      }
    });
  }

  static ngTemplateContextGuard<T>(
    directive: NgxLetDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxLet: T;
}

