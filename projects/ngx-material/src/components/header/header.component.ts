import {
  booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, inject, input,
  OnDestroy, OnInit, Output, signal, Signal
} from '@angular/core';
import {MatRippleModule} from "@angular/material/core";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Subscription} from "rxjs";
import {IconDirective, TruthyPipe} from "@juulsgaard/ngx-tools";
import {UIScopeContext} from "../../models";
import {SidebarService} from "../../services";
import {map} from "rxjs/operators";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'ngx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatRippleModule,
    NgIf,
    MatIconModule,
    TruthyPipe,
    IconDirective
  ],
  standalone: true,
  host: {'[class.ngx-header]': 'true'}
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  heading = input<string>();
  subHeading = input<string>();
  hideClose = input(false, {transform: booleanAttribute});

  @HostBinding('class')
  headerClass: string[] = [];

  showMenu: Signal<boolean>;

  private sub?: Subscription;
  private sidebarService = inject(SidebarService, {optional: true});
  private uiContext = inject(UIScopeContext, {optional: true});

  constructor(
    private changes: ChangeDetectorRef
  ) {
    if (this.sidebarService && this.uiContext) {
      this.showMenu = toSignal(this.uiContext.header$.pipe(map(x => x.showMenu)), {initialValue: false});
    } else {
      this.showMenu = signal(false);
    }
  }

  ngOnInit() {
    this.sub = this.uiContext?.registerHeader(x => {
      this.headerClass = x.classes;
      this.changes.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  openMenu() {
    this.sidebarService?.toggle(true)
  }
}
