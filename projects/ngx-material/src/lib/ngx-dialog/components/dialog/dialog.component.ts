import {
  booleanAttribute, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, inject, Injector, Input, OnDestroy,
  OnInit, Output, ViewChild
} from '@angular/core';
import {DialogFooterDirective} from "../../directives/dialog-footer.directive";
import {DialogManagerService} from "../../services/dialog-manager.service";
import {DialogFooterTemplateDirective} from "../../directives/dialog-footer-template.directive";
import {DialogContentTemplateDirective} from "../../directives/dialog-content-template.directive";
import {
  auditTime, BehaviorSubject, distinctUntilChanged, Observable, of, ReplaySubject, Subscription, switchMap
} from "rxjs";
import {TemplateDialogInstance} from "../../models/template-dialog-context";
import {map} from "rxjs/operators";
import {RenderSource, RenderSourceDirective} from "@juulsgaard/ngx-tools";
import {NgxDialogDefaults} from "../../models/dialog-defaults";
import {arrToSet, setToArr} from "@juulsgaard/ts-tools";


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

  private defaults = inject(NgxDialogDefaults);

  private readonly content$: Observable<RenderSource>;
  private readonly footer$: Observable<RenderSource|undefined>;

  header$ = new ReplaySubject<string>(1);
  scrollable$ = new BehaviorSubject(false);
  type$ = new BehaviorSubject<string|undefined>(undefined);
  styles$ = new BehaviorSubject<string[]>([]);

  @Input() set header(header: string) {
    this.header$.next(header);
  }

  @Input({transform: booleanAttribute}) set scrollable(scrollable: boolean) {
    this.scrollable$.next(scrollable);
  }

  @Input()
  set type(type: string|undefined) {
    this.type$.next(type);
  }

  @Input()
  set styles(styles: string[]|string|undefined) {
    this.styles$.next(Array.isArray(styles) ? styles : styles ? [styles] : []);
  }

  private show$ = new BehaviorSubject(true);
  @Input() set show(show: boolean|undefined) {this.show$.next(show !== false)};
  @Output() showChange = new EventEmitter<boolean>();

  @Output() close = new EventEmitter<void>();

  private canClose$ = new BehaviorSubject(true);
  @Input({transform: booleanAttribute}) set disableClose(disable: boolean) {
    this.canClose$.next(!disable);
  }

  private instance?: TemplateDialogInstance;
  private sub?: Subscription;
  private instanceSub?: Subscription;

  private injector = inject(Injector);
  private manager = inject(DialogManagerService);

  constructor() {
    this.content$ = this.contentTemplate$.pipe(
      map(template => template ?? this.content),
      auditTime(0), // Move to next cycle so changes don't clash with Change Detection
      distinctUntilChanged()
    );

    this.footer$ = this.footerTemplate$.pipe(
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
  }

  ngOnInit() {
    this.sub = this.show$.pipe(
      distinctUntilChanged()
    ).subscribe(show => this.toggleDialog(show));
  }

  private toggleDialog(show: boolean) {
    if (this.instance) {
      this.manager.closeDialog(this.instance);
      this.instanceSub?.unsubscribe();
    }

    if (!show) return;

    this.instance = this.manager.createDialog(
      {
        content$: this.content$,
        footer$: this.footer$,
        header$: this.header$,
        scrollable$: this.scrollable$,
        canClose$: this.canClose$,
        type$: this.type$.pipe(map(x => x ?? this.defaults.type)),
        styles$: this.styles$.pipe(map(x => setToArr(arrToSet([...x, ...this.defaults.styles])))),
      },
      this.injector
    );

    this.instanceSub = this.instance.close$.subscribe(() => {
      this.close.emit();
      this.showChange.emit(false);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.instanceSub?.unsubscribe();
    if (!this.instance) return;
    this.manager.closeDialog(this.instance);
  }
}
