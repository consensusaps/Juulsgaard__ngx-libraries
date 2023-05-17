import {ChangeDetectorRef, Directive, HostBinding, inject, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Dispose} from "@consensus-labs/ngx-tools";
import {BaseUIScopeContext, UIScopeContext} from "../models/ui-scope";

@Directive({
  selector: '[wrapContent]',
  standalone: true,
  providers: [{provide: UIScopeContext, useExisting: WrapContentDirective}]
})
export class WrapContentDirective extends BaseUIScopeContext implements OnInit {

  @Dispose
  private sub?: Subscription;

  @HostBinding('class')
  wrapperClass: string[] = [];

  private context: UIScopeContext;

  constructor(
    private changes: ChangeDetectorRef
  ) {
    const context = inject(UIScopeContext, {skipSelf: true});
    super(context.childScope$);
    this.context = context;
  }

  ngOnInit() {
    this.sub = this.context.wrapperClass$.subscribe(x => {
      this.wrapperClass = x ? [x, 'scrollable-content'] : [];
      this.changes.detectChanges();
    });
  }

}
