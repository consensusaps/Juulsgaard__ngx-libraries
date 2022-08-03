import {Directive, forwardRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {ControlContainer} from "@angular/forms";
import {BehaviorSubject, combineLatest, ReplaySubject, Subscription} from "rxjs";
import {ControlFormLayer, ControlFormList, SmartFormUnion} from "@consensus-labs/ngx-forms-core";

@Directive({
  selector: '[formList][formListIn]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => FormListDirective)
  }]
})
export class FormListDirective<TControls extends Record<string, SmartFormUnion>> extends ControlContainer implements OnInit, OnDestroy {

  list?: ControlFormList<TControls>;
  context$ = new ReplaySubject<FormListDirectiveContext<TControls>[]>(1);
  controlSub?: Subscription;
  @Input() set formListIn(list: ControlFormList<TControls>) {
    this.list = list;
    this.controlSub?.unsubscribe();
    this.controlSub = list.controls$.subscribe(
      controls => this.context$.next(controls.map(x => new FormListDirectiveContext(x)))
    );
  }

  visible$ = new BehaviorSubject(true);
  @Input() set formListWhen(show: boolean) {
    this.visible$.next(show);
  }

  isRendered = false;
  sub?: Subscription;

  constructor(
    private templateRef: TemplateRef<FormListDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {
    super();
  }

  ngOnInit() {
    this.sub = combineLatest([this.context$, this.visible$]).subscribe(([context, visible]) => {
      if (this.isRendered) this.viewContainer.clear();
      if (!visible) return;

      for (let c of context) {
        this.viewContainer.createEmbeddedView(this.templateRef, c);
      }

      this.isRendered = true;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get control() {
    return this.list ?? null;
  }
}

class FormListDirectiveContext<TControls extends Record<string, SmartFormUnion>> {

  $implicit: TControls;

  constructor(list: ControlFormLayer<TControls>) {
    this.$implicit = list.controls;
  }
}
