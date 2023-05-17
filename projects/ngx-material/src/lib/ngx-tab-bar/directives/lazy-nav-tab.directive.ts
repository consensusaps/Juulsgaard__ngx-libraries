import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {NavTabBarContext, NavTabContext} from "../services";
import {Subscription} from "rxjs";

@Directive({
  selector: '[lazyTab]',
  providers: [{provide: NavTabContext, useExisting: LazyNavTabDirective}]
})
export class LazyNavTabDirective extends NavTabContext implements OnInit, OnDestroy {

  @Input('lazyTab') id!: string;
  @Input('lazyTabName') tabName?: string;

  get name() {
    return this.tabName ?? this.id
  }

  @Input('lazyTabDisabled') disabled = false;
  @Input('lazyTabHide') hide = false;

  private sub?: Subscription;
  private visible = false;

  constructor(
    context: NavTabBarContext,
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
