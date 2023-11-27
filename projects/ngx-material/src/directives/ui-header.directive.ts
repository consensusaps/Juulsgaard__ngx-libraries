import {ChangeDetectorRef, Directive, HostBinding, inject} from '@angular/core';
import {UIScopeContext} from "../models";
import {Dispose} from "@juulsgaard/ngx-tools";
import {Subscription} from "rxjs";

@Directive({selector: '[uiHeader]', standalone: true})
export class UiHeaderDirective {

  @HostBinding('class')
  headerClass: string[] = [];

  private uiContext = inject(UIScopeContext, {optional: true});
  @Dispose private sub: Subscription | undefined;

  constructor(changes: ChangeDetectorRef) {
    this.sub = this.uiContext?.registerHeader(x => {
      this.headerClass = x.classes;
      changes.detectChanges();
    });
  }

}
