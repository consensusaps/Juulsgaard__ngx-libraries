import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, EventEmitter, inject, input, InputSignal,
  InputSignalWithTransform, Output, Signal
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

  readonly heading: InputSignal<string | undefined> = input<string>();
  readonly subHeading: InputSignal<string | undefined> = input<string>();
  readonly hideClose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly hideBack: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly headerClass: Signal<string[]>;
  readonly showMenu: Signal<boolean>;

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
