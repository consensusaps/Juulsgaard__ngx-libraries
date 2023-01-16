import {ChangeDetectorRef, ComponentRef, Directive, Injector, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {RenderDialogComponent} from "../components/render-dialog/render-dialog.component";
import {Subscription} from "rxjs";
import {OverlayService} from "@consensus-labs/ngx-tools";
import {DialogManagerService} from "../services/dialog-manager.service";
import {DialogContext} from "../models/dialog-context.models";
import {DIALOG_CONTEXT, DIALOG_Z_INDEX} from "../models/dialog-tokens.models";

@Directive({
  selector: 'ngx-dialog-outlet'
})
export class DialogOutletDirective implements OnDestroy, OnInit {

  private sub?: Subscription;
  private dialog?: ComponentRef<RenderDialogComponent>;

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: DialogManagerService,
    private overlayService: OverlayService,
    private changes: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    this.sub = this.manager.dialog$.subscribe(dialog => this.renderDialog(dialog));
  }

  renderDialog(context: DialogContext | undefined) {

    this.dialog?.destroy();

    if (!context) return;

    const overlayToken = this.overlayService.pushOverlay();
    overlayToken.handleEscape(() => context.onClose?.());

    const injector = Injector.create({
      parent: context.injector ?? this.viewContainer.injector,
      providers: [
        {provide: DIALOG_CONTEXT, useValue: context},
        {provide: DIALOG_Z_INDEX, useValue: overlayToken.zIndex},
      ],
      name: 'Dialog Injector'
    });

    this.dialog = this.viewContainer.createComponent<RenderDialogComponent>(
      RenderDialogComponent,
      {injector: injector}
    );

    this.dialog.onDestroy(() => overlayToken.dispose())

    this.changes.detectChanges();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.viewContainer.clear();
  }

}

