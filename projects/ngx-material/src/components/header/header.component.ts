import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, EventEmitter, inject, input, Output, Signal
} from '@angular/core';
import {MatRippleModule} from "@angular/material/core";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {IconDirective, TruthyPipe} from "@juulsgaard/ngx-tools";
import {UIScopeContext} from "../../models";
import {SidebarService} from "../../services";

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
  host: {'[class.ngx-header]': 'true', '[class]': 'headerClass()'}
})
export class HeaderComponent {

  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  heading = input<string>();
  subHeading = input<string>();
  hideClose = input(false, {transform: booleanAttribute});
  hideBack = input(false, {transform: booleanAttribute});

  headerClass: Signal<string[]>;
  showMenu: Signal<boolean>;

  private sidebarService = inject(SidebarService, {optional: true});
  private uiContext = inject(UIScopeContext, {optional: true});

  constructor() {
    const header = this.uiContext?.registerHeader();

    this.headerClass = computed(() => {
      if (!header) return [];
      return header().classes;
    });

    this.showMenu = computed(() => {
      if (!this.sidebarService || !header) return false;
      return header().showMenu;
    });
  }

  openMenu() {
    this.sidebarService?.toggle(true)
  }
}
