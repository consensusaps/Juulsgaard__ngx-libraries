import {Directive, forwardRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {BehaviorSubject, combineLatest, ReplaySubject, Subscription} from "rxjs";
import {AnyControlFormRoot, ControlFormRoot, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[form][formFrom]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => FormDirective)
  }]
})
export class FormDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnInit, OnDestroy {

  form?: AnyControlFormRoot<TControls>;
  context$ = new ReplaySubject<FormDirectiveContext<TControls>>(1);
  @Input() set formFrom(form: AnyControlFormRoot<TControls>) {
    this.form = form;
    this.context$.next(new FormDirectiveContext(form));
  };

  visible$ = new BehaviorSubject(true);
  @Input() set formWhen(show: boolean) {
    this.visible$.next(show);
  }

  isRendered = false;
  sub?: Subscription;

  constructor(
    private templateRef: TemplateRef<FormDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();
  }

  ngOnInit() {
    this.sub = combineLatest([this.context$, this.visible$]).subscribe(([context, visible]) => {
      if (this.isRendered) this.viewContainer.clear();
      if (!visible) return;

      this.viewContainer.createEmbeddedView(this.templateRef, context);
      this.isRendered = true;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get control() {
    return this.form ?? null;
  }
}

class FormDirectiveContext<TControls extends Record<string, SmartFormUnion>> {

  $implicit: TControls;

  constructor(form: AnyControlFormRoot<TControls>) {
    this.$implicit = form.controls;
  }
}
