import {
  Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef
} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {AnyControlFormRoot, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[ngxForm]',
  providers: [{
    provide: ControlContainer,
    useExisting: FormDirective
  }]
})
export class FormDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnChanges, OnDestroy {

  @Input() form?: AnyControlFormRoot<TControls>;
  @Input('ngxFormWhen') show?: boolean;

  view?: EmbeddedViewRef<FormDirectiveContext<TControls>>

  constructor(
    private templateRef: TemplateRef<FormDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['form'] && !changes['show']) return;

    this.view?.destroy();

    if (this.show === false) return;
    if (!this.form) return;

    const context = new FormDirectiveContext(this.form);
    const view = this.viewContainer.createEmbeddedView(this.templateRef, context);
    const sub = this.form.controls$.subscribe(controls => {
      context.ngxForm = controls;
      view?.detectChanges();
    });
    view.onDestroy(() => sub.unsubscribe());

    this.view = view;
  }

  ngOnDestroy() {
    this.view?.destroy();
  }

  get control() {
    return this.form ?? null;
  }
}

class FormDirectiveContext<TControls extends Record<string, SmartFormUnion>> {

  ngxForm: TControls;

  constructor(form: AnyControlFormRoot<TControls>) {
    this.ngxForm = form.controls;
  }
}
