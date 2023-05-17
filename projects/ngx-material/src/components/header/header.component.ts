import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, inject, Input, OnDestroy, OnInit,
  Output
} from '@angular/core';
import {MatRippleModule} from "@angular/material/core";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {TruthyPipe} from "@consensus-labs/ngx-tools";

@Component({
  selector: 'ngx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatRippleModule,
    NgIf,
    MatIconModule,
    TruthyPipe
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

  isTopLevel$: Observable<boolean>;

  private sub?: Subscription;
  //TODO: Generic Sidebar service
  sidebarService = inject(SidebarService, {optional: true});

  //TODO: Generic UI Scopes
  constructor(
    private context: UIScopeContext,
    private changes: ChangeDetectorRef
  ) {
    this.isTopLevel$ = context.scope$.pipe(map(s => s === 'root'));
  }

  ngOnInit() {
    this.context.registerHeader(this);

    this.sub = this.context.headerClass$.subscribe(x => {
      this.headerClass = x ? [x] : [];
      this.changes.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.context.unregisterHeader(this);
  }
}
