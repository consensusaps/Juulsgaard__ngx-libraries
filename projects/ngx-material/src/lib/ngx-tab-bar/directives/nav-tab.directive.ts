import {Directive, ElementRef, Input} from '@angular/core';
import {Subscription} from "rxjs";
import {NavTabBarContext, NavTabContext} from "../services";

@Directive({
  selector: '[navTab]',
  providers: [{provide: NavTabContext, useExisting: NavTabDirective}],
  host: {'[class.ngx-nav-tab]': 'true'}
})
export class NavTabDirective extends NavTabContext {

  @Input('navTab') id!: string;
  @Input() tabName?: string;
  get name() {return this.tabName ?? this.id}

  @Input() disabled = false;
  @Input() hide = false;

  sub: Subscription;

  constructor(context: NavTabBarContext, private element: ElementRef<HTMLElement>) {
    super(context);

    this.sub = this.isOpen$.subscribe(
      show => this.element.nativeElement.style.display = show ? '' : 'none'
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

