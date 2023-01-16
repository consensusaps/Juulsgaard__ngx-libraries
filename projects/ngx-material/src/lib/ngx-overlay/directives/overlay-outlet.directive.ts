import {
  ChangeDetectorRef, ComponentRef, Directive, Inject, Injector, OnInit, Optional, StaticProvider, ViewContainerRef
} from '@angular/core';
import {Subscription} from "rxjs";
import {OverlayInstance, OverlayManagerService} from "../services/overlay-manager.service";
import {
  BASE_OVERLAY_PROVIDERS, OVERLAY_ANIMATE_IN, OVERLAY_CONTEXT, OVERLAY_Z_INDEX
} from "../models/overlay-tokens.models";
import {RenderOverlayComponent} from "../components/render-overlay/render-overlay.component";

@Directive({selector: 'ngx-overlay-outlet'})
export class OverlayOutletDirective implements OnInit {

  private sub?: Subscription;
  private component?: ComponentRef<RenderOverlayComponent>;

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: OverlayManagerService,
    private changes: ChangeDetectorRef,
    @Optional() @Inject(BASE_OVERLAY_PROVIDERS)
    private baseProviders: StaticProvider[] = []
  ) { }

  ngOnInit() {
    this.sub = this.manager.overlay$.subscribe(x => this.renderDialog(x.item, x.added));
  }

  renderDialog(instance: OverlayInstance | undefined, added: boolean) {

    if (this.component) {
      this.component.instance.animate = !instance || !added;
      this.component.changeDetectorRef.detectChanges();
      this.component.destroy();
    }

    if (!instance) return;

    const injector = Injector.create({
      parent: instance.context.injector ?? this.viewContainer.injector,
      providers: [
        {provide: OVERLAY_CONTEXT, useValue: instance.context},
        {provide: OVERLAY_Z_INDEX, useValue: instance.token.zIndex},
        {provide: OVERLAY_ANIMATE_IN, useValue: added},
        ...this.baseProviders
      ],
      name: 'Overlay Injector'
    });

    this.component = this.viewContainer.createComponent<RenderOverlayComponent>(
      RenderOverlayComponent,
      {injector: injector}
    );

    this.changes.detectChanges();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.viewContainer.clear();
  }
}
