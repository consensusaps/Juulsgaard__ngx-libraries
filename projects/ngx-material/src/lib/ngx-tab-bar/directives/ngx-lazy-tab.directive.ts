import {Directive, forwardRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {NgxTabBarContext, NgxTabContext} from "../services";
import {Subscription} from "rxjs";
import {UIScopeContext} from "../../../models";
import {TabPanelUIScopeContext} from "../services/tab-panel-ui-scope.context";

@Directive({
  selector: '[ngxLazyTab]',
  providers: [
    {provide: NgxTabContext, useExisting: forwardRef(() => NgxLazyTabDirective)},
    {provide: UIScopeContext, useExisting: TabPanelUIScopeContext}
  ]
})
export class NgxLazyTabDirective extends NgxTabContext implements OnInit, OnDestroy {

  @Input('ngxLazyTab') id!: string;
  @Input('ngxLazyTabName') tabName?: string;

  get name() {
    return this.tabName ?? this.id
  }

  @Input('ngxLazyTabDisabled') set disabled(disabled: boolean) {
    this._disabled$.next(disabled);
  }

  @Input('ngxLazyTabHide') set hide(hide: boolean) {
    this._hidden$.next(hide);
  }

  private sub?: Subscription;
  private visible = false;

  constructor(
    context: NgxTabBarContext,
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef
  ) {
    super(context);
  }

  ngOnInit() {
    this.sub = this.isOpen$.subscribe(c => this.updateView(c));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private updateView(show: boolean) {

    if (this.visible) {
      if (show) return;

      this.viewContainer.clear();
      this.visible = false;
      return;
    }

    if (!show) return;
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.visible = true;
  }
}
