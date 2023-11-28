import {ChangeDetectorRef, Directive, HostBinding, inject, OnInit} from '@angular/core';
import {UIScopeContext} from "../models";
import {Dispose} from "@juulsgaard/ngx-tools";
import {Subscription} from "rxjs";

@Directive({selector: '[uiHeader]', standalone: true})
export class UiHeaderDirective implements OnInit {

  @HostBinding('class')
  headerClass: string[] = [];

  private uiContext = inject(UIScopeContext, {optional: true});
  @Dispose private sub?: Subscription;

  constructor(private changes: ChangeDetectorRef) {}

  ngOnInit() {
    this.sub = this.uiContext?.registerHeader(x => {
      this.headerClass = x.classes;
      this.changes.detectChanges();
    });
  }
}
