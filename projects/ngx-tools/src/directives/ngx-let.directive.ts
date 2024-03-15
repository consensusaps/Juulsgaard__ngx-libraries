import {
  Directive, effect, EmbeddedViewRef, input, InputSignal, TemplateRef, untracked, ViewContainerRef
} from '@angular/core';

@Directive({selector: '[ngxLet]', standalone: true})
export class NgxLetDirective<T> {

  readonly value: InputSignal<T> = input.required<T>({alias: 'ngxLet'});

  private view?: EmbeddedViewRef<TemplateContext<T>>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    effect(() => {
      const value = this.value();

      untracked(() => {
        if (!this.view) {
          this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxLet: value});
          this.view.detectChanges();
          this.view.markForCheck();
        } else {
          this.view.context.ngxLet = value;
          this.view.markForCheck();
        }
      });
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

