import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, inject, Input, OnDestroy, OnInit,
  Output
} from '@angular/core';
import {MatRippleModule} from "@angular/material/core";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Observable, of, Subscription} from "rxjs";
import {IconDirective, TruthyPipe} from "@consensus-labs/ngx-tools";
import {UIScopeContext} from "../../models/ui-scope";
import {SidebarService} from "../../services/sidebar.service";

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
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() heading?: string;
  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Input() hideClose = false;

  @HostBinding('class')
  headerClass: string[] = [];

  showMenu$: Observable<boolean>;

  private sub?: Subscription;
  private sidebarService = inject(SidebarService, {optional: true});
  private uiContext = inject(UIScopeContext, {optional: true});

  constructor(
    private changes: ChangeDetectorRef
  ) {
    if (this.sidebarService) {
      this.showMenu$ = this.uiContext?.showMenu$ ?? of(true);
    } else {
      this.showMenu$ = of(false);
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
