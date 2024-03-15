import {ComponentRef, Directive, Injector, ViewContainerRef} from '@angular/core';
import {RenderDialogComponent} from "../components/render-dialog/render-dialog.component";
import {asapScheduler, auditTime} from "rxjs";
import {DialogManagerService} from "../services/dialog-manager.service";
import {DialogInstance} from "../models/dialog-context";
import {DIALOG_ANIMATE_IN, DIALOG_CONTEXT} from "../models/dialog-tokens";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: 'ngx-dialog-outlet'
})
export class DialogOutletDirective {

  private component?: ComponentRef<RenderDialogComponent>;

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: DialogManagerService
  ) {
    this.manager.dialog$.pipe(
      auditTime(0, asapScheduler),
      takeUntilDestroyed()
    ).subscribe(({item, added}) => this.renderDialog(item, added));
  }

  renderDialog(instance: DialogInstance | undefined, added: boolean) {

    if (this.component) {
      this.component.instance.animate = !instance || !added;
      this.component.changeDetectorRef.markForCheck();
      this.component.destroy();
      this.component = undefined;
    }

    if (!instance) return;

    const injector = Injector.create({
      parent: instance.injector ?? this.viewContainer.injector,
      providers: [
        {provide: DIALOG_CONTEXT, useValue: instance},
        {provide: DIALOG_ANIMATE_IN, useValue: added},
      ],
      name: 'Dialog Injector'
    });

    this.component = this.viewContainer.createComponent<RenderDialogComponent>(
      RenderDialogComponent,
      {injector: injector}
    );

    this.component.changeDetectorRef.detectChanges();
    this.component.changeDetectorRef.markForCheck();
  }
}

