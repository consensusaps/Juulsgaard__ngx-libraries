import {
  ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Injector, Input, OnDestroy, OnInit, Output,
  TemplateRef, ViewChild
} from '@angular/core';
import {DialogFooterDirective} from "../../directives/dialog-footer.directive";
import {BehaviorSubject, distinctUntilChanged, ReplaySubject} from "rxjs";
import {DialogManagerService} from "../../services/dialog-manager.service";
import {TemplateDialogContext} from "../../models/dialog-context.models";


@Component({
  selector: 'ngx-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, OnDestroy {

  @ContentChild(DialogFooterDirective) set footerItem(item: DialogFooterDirective|undefined) {
    this.footer$.next(item ? this.footer : undefined);
  };

  @ViewChild('content', {static: true})
  content!: TemplateRef<void>;
  @ViewChild('footer', {static: true})
  footer!: TemplateRef<void>;

  footer$ = new ReplaySubject<TemplateRef<void>|undefined>(1);
  content$ = new ReplaySubject<TemplateRef<void>>(1);
  header$ = new ReplaySubject<string>(1);
  withScroll$ = new BehaviorSubject(false);

  @Input() set header(header: string) {
    this.header$.next(header);
  }

  @Input() set withScroll(withScroll: boolean) {
    this.withScroll$.next(withScroll);
  }

  @Output() close = new EventEmitter<void>();

  private readonly context: TemplateDialogContext;

  constructor(
    private manager: DialogManagerService,
    private injector: Injector
  ) {
    this.context = {
      header$: this.header$,
      withScroll$: this.withScroll$,
      onClose: () => this.close.emit(),
      content$: this.content$,
      footer$: this.footer$.pipe(distinctUntilChanged()),
      injector: this.injector
    };
  }

  ngOnInit() {
    this.content$.next(this.content);
    this.manager.createDialog(this.context);
  }

  ngOnDestroy() {
    this.manager.closeDialog(this.context);
  }
}
