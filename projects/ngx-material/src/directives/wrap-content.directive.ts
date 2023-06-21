import {
  ChangeDetectorRef, Directive, ElementRef, forwardRef, HostBinding, inject, NgZone, OnDestroy, OnInit
} from '@angular/core';
import {Subscription} from "rxjs";
import {BaseUIScopeContext, UIScopeContext} from "../models/ui-scope";
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";

@Directive({
  selector: '[wrapContent]',
  standalone: true,
  providers: [{provide: UIScopeContext, useExisting: forwardRef(() => WrapContentDirective)}]
})
export class WrapContentDirective extends BaseUIScopeContext implements OnInit, OnDestroy {

  private sub?: Subscription;

  @HostBinding('class')
  wrapperClass: string[] = [];

  private context: UIScopeContext;
  private scrollable: CdkScrollable;

  constructor(
    private changes: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    elementRef: ElementRef<HTMLElement>,
    ngZone: NgZone,
  ) {
    const context = inject(UIScopeContext, {skipSelf: true});
    super(context);

    this.context = context;

    this.scrollable = new CdkScrollable(elementRef, scrollDispatcher, ngZone);
  }

  ngOnInit() {
    this.sub = this.context.registerWrapper(x => {
      this.wrapperClass = x.classes;
      this.changes.detectChanges();
      if (x.scrollable) this.scrollDispatcher.register(this.scrollable);
      else this.scrollDispatcher.deregister(this.scrollable);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.scrollDispatcher.deregister(this.scrollable);
  }

}
