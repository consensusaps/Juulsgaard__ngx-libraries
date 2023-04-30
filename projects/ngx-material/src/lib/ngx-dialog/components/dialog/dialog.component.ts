import {
  ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import {DialogFooterDirective} from "../../directives/dialog-footer.directive";
import {DialogManagerService} from "../../services/dialog-manager.service";
import {DialogFooterTemplateDirective} from "../../directives/dialog-footer-template.directive";
import {DialogContentTemplateDirective} from "../../directives/dialog-content-template.directive";
import {auditTime, BehaviorSubject, distinctUntilChanged, of, ReplaySubject, Subscription, switchMap} from "rxjs";
import {TemplateDialogInstance} from "../../models/template-dialog-context";
import {map} from "rxjs/operators";
import {RenderSource, RenderSourceDirective} from "@consensus-labs/ngx-tools";


@Component({
  selector: 'ngx-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit, OnDestroy {

  contentTemplate$ = new BehaviorSubject<RenderSource|undefined>(undefined);
  @ContentChild(DialogContentTemplateDirective)
  set contentTmpl(item: DialogContentTemplateDirective | undefined) {
    this.contentTemplate$.next(item);
  };

  footerTemplate$ = new BehaviorSubject<RenderSource|undefined>(undefined);
  @ContentChild(DialogFooterTemplateDirective)
  set footerTmpl(item: DialogFooterTemplateDirective | undefined) {
    this.footerTemplate$.next(item);
  };

  hasFooter$ = new BehaviorSubject(false);
  @ContentChild(DialogFooterDirective)
  set footerItem(item: DialogFooterDirective | undefined) {
    this.hasFooter$.next(!!item);
  };

  @ViewChild('content', {static: true, read: RenderSourceDirective})
  content!: RenderSource;
  @ViewChild('footer', {static: true, read: RenderSourceDirective})
  footer!: RenderSource;

  header$ = new ReplaySubject<string>(1);
  withScroll$ = new BehaviorSubject(false);

  @Input() set header(header: string) {
    this.header$.next(header);
  }

  @Input() set withScroll(withScroll: boolean) {
    this.withScroll$.next(withScroll);
  }

  private show$ = new BehaviorSubject(true);
  @Input() set show(show: boolean|undefined) {this.show$.next(show !== false)};
  @Output() showChange = new EventEmitter<boolean>();

  @Output() close = new EventEmitter<void>();

  private instance?: TemplateDialogInstance;
  private sub?: Subscription;

  constructor(private injector: Injector, private manager: DialogManagerService) {

  }

  ngOnInit() {

    const content$ = this.contentTemplate$.pipe(
      map(template => template ?? this.content),
      auditTime(0), // Move to next cycle so changes don't clash with Change Detection
      distinctUntilChanged()
    );

    const footer$ = this.footerTemplate$.pipe(
      switchMap(
        template => template
          ? of(template)
          : this.hasFooter$.pipe(
            map(x => x ? this.footer : undefined)
          )
      ),
      auditTime(0), // Move to next cycle so changes don't clash with Change Detection
      distinctUntilChanged()
    );

    this.sub = this.show$.pipe(
      distinctUntilChanged()
    ).subscribe(show => {

      if (this.instance) {
        this.manager.closeDialog(this.instance);
      }

      if (!show) return;

      this.instance = this.manager.createDialog(
        this.injector,
        content$,
        footer$,
        {
          header$: this.header$,
          withScroll$: this.withScroll$
        }
      );

      this.instance.onClose(() => {
        this.close.emit();
        this.showChange.emit(false);
      });
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (!this.instance) return;
    this.manager.closeDialog(this.instance);
  }
}
