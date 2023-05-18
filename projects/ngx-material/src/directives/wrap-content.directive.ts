import {ChangeDetectorRef, Directive, forwardRef, HostBinding, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {BaseUIScopeContext, UIScopeContext} from "../models/ui-scope";

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

  constructor(
    private changes: ChangeDetectorRef
  ) {
    const context = inject(UIScopeContext, {skipSelf: true});
    super(context.childScope$, context.passiveChildScope$);
    this.context = context;
  }

  ngOnInit() {
    this.sub = this.context.wrapperClasses$.subscribe(x => {
      this.wrapperClass = x;
      this.changes.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

}
