import {Directive, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewContainerRef} from "@angular/core";
import {BehaviorSubject, distinctUntilChanged, ReplaySubject} from "rxjs";
import {TemplateDialogInstance} from "../models/template-dialog-context";
import {DialogManagerService} from "../services/dialog-manager.service";

@Directive()
export abstract class BaseDialogDirective implements OnInit, OnDestroy {

  content$ = new ReplaySubject<TemplateRef<void>>(1);
  footer$ = new ReplaySubject<TemplateRef<void> | undefined>(1);
  header$ = new ReplaySubject<string>(1);
  withScroll$ = new BehaviorSubject(false);

  @Input() set header(header: string) {
    this.header$.next(header);
  }

  @Input() set withScroll(withScroll: boolean) {
    this.withScroll$.next(withScroll);
  }

  @Output() close = new EventEmitter<void>();

  private instance?: TemplateDialogInstance;

  protected constructor(
    private viewContainer: ViewContainerRef,
    private manager: DialogManagerService
  ) {
  }

  ngOnInit() {
    this.instance = this.manager.createDialog(
      this.viewContainer,
      this.content$,
      this.footer$.pipe(distinctUntilChanged()),
      {
        header$: this.header$,
        withScroll$: this.withScroll$
      }
    );
    this.instance.onClose(() => this.close.emit());
  }

  ngOnDestroy() {
    if (!this.instance) return;
    this.manager.closeDialog(this.instance);
  }
}
