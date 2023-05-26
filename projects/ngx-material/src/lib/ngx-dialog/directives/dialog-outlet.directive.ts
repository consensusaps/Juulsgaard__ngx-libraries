import {ChangeDetectorRef, ComponentRef, Directive, Injector, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {RenderDialogComponent} from "../components/render-dialog/render-dialog.component";
import {Subscription} from "rxjs";
import {DialogManagerService} from "../services/dialog-manager.service";
import {DialogInstance} from "../models/dialog-context";
import {DIALOG_ANIMATE_IN, DIALOG_CONTEXT} from "../models/dialog-tokens";

@Directive({
  selector: 'ngx-dialog-outlet',
  standalone: true
})
export class DialogOutletDirective implements OnDestroy, OnInit {

  private sub?: Subscription;
  private component?: ComponentRef<RenderDialogComponent>;

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: DialogManagerService,
    private changes: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    this.sub = this.manager.dialog$.subscribe(({item, added}) => this.renderDialog(item, added));
  }

  renderDialog(instance: DialogInstance | undefined, added: boolean) {

    if (this.component) {
      this.component.instance.animate = !instance || !added;
      this.component.changeDetectorRef.detectChanges();
      this.component.destroy();
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

    this.changes.detectChanges();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.viewContainer.clear();
  }

}

