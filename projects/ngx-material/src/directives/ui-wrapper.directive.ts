import {
  ChangeDetectorRef, Directive, ElementRef, forwardRef, HostBinding, inject, NgZone, OnDestroy, OnInit
} from '@angular/core';
import {Subscription} from "rxjs";
import {BaseUIScopeContext, UIScopeContext} from "../models/ui-scope";
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";
import {IScrollContext, ScrollContext} from "@juulsgaard/ngx-tools";

@Directive({
  selector: '[uiWrapper],ui-wrapper',
  standalone: true,
  providers: [
    {provide: UIScopeContext, useExisting: forwardRef(() => UiWrapperDirective)},
    ScrollContext.Provide(() => UiWrapperDirective)
  ],
  host: {'[class.ui-wrapper]': 'true'}
})
export class UiWrapperDirective extends BaseUIScopeContext implements OnInit, OnDestroy, IScrollContext {

  private sub?: Subscription;

  @HostBinding('class')
  wrapperClass: string[] = [];
  scrollable = false;

  private context: UIScopeContext;
  cdkScrollable: CdkScrollable;

  constructor(
    private changes: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    readonly element: ElementRef<HTMLElement>,
    ngZone: NgZone,
  ) {
    const context = inject(UIScopeContext, {skipSelf: true});
    super(context);

    this.context = context;

    this.cdkScrollable = new CdkScrollable(element, scrollDispatcher, ngZone);
  }

  ngOnInit() {
    this.sub = this.context.registerWrapper(x => {
      this.wrapperClass = x.classes;
      this.scrollable = x.scrollable;
      this.changes.detectChanges();
      if (x.scrollable) this.scrollDispatcher.register(this.cdkScrollable);
      else this.scrollDispatcher.deregister(this.cdkScrollable);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.scrollDispatcher.deregister(this.cdkScrollable);
  }

}
