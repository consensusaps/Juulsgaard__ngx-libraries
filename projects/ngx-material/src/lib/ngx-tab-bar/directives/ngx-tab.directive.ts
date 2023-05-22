import {Directive, ElementRef, forwardRef, Input} from '@angular/core';
import {Subscription} from "rxjs";
import {NgxTabBarContext, NgxTabContext} from "../services";
import {UIScopeContext} from "../../../models";
import {TabUIScopeContext} from "../services/tab-ui-scope.context";

@Directive({
  selector: '[ngxTab]',
  providers: [
    {provide: NgxTabContext, useExisting: forwardRef(() => NgxTabDirective)},
    {provide: UIScopeContext, useClass: TabUIScopeContext}
  ],
  host: {'[class.ngx-tab]': 'true'}
})
export class NgxTabDirective extends NgxTabContext {

  @Input('ngxTab') id!: string;
  @Input() tabName?: string;
  get name() {return this.tabName ?? this.id}

  @Input() set disabled(disabled: boolean) {
    this._disabled$.next(disabled);
  }

  @Input() set hide(hide: boolean) {
    this._hidden$.next(hide);
  }

  sub: Subscription;

  constructor(context: NgxTabBarContext, private element: ElementRef<HTMLElement>) {
    super(context);

    this.sub = this.isOpen$.subscribe(
      show => this.element.nativeElement.style.display = show ? '' : 'none'
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

