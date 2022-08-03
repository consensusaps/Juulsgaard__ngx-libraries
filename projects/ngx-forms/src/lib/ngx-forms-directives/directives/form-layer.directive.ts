import {Directive, forwardRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {BehaviorSubject, combineLatest, ReplaySubject, Subscription} from "rxjs";
import {AnyControlFormLayer, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[formLayer][formLayerFrom]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => FormLayerDirective)
  }]
})
export class FormLayerDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnInit, OnDestroy {

  layer?: AnyControlFormLayer<TControls>;
  context$ = new ReplaySubject<FormLayerDirectiveContext<TControls>>(1);
  @Input() set formLayerFrom(layer: AnyControlFormLayer<TControls>) {
    this.layer = layer;
    this.context$.next(new FormLayerDirectiveContext(layer));
  }

  visible$ = new BehaviorSubject(true);
  @Input() set formLayerWhen(show: boolean) {
    this.visible$.next(show);
  }

  isRendered = false;
  sub?: Subscription;

  constructor(
    private templateRef: TemplateRef<FormLayerDirectiveContext<TControls>>,
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
    return this.layer ?? null;
  }
}

class FormLayerDirectiveContext<TControls extends Record<string, SmartFormUnion>> {

  $implicit: TControls;

  constructor(form: AnyControlFormLayer<TControls>) {
    this.$implicit = form.controls as TControls;
  }
}
