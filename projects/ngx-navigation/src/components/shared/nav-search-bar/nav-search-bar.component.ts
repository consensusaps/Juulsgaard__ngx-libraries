import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit
} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {SearchInputComponent} from "@consensus-labs/ngx-forms-inputs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'ngx-nav-search-bar',
  templateUrl: './nav-search-bar.component.html',
  styleUrls: ['./nav-search-bar.component.scss'],
  standalone: true,
  imports: [
    SearchInputComponent,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavSearchBarComponent implements OnInit, OnDestroy {

  @Input() query$?: Subject<string|undefined>;

  @HostBinding('class')
  headerClass: string[] = [];

  private sub?: Subscription;

  constructor(
    // private context: UIScopeContext,
    private changes: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    // this.sub = this.context.headerClass$.subscribe(x => {
    //   this.headerClass = x ? [x] : [];
    //   this.changes.detectChanges();
    // });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

}
