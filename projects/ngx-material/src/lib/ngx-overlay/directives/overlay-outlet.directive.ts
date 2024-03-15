import {ComponentRef, Directive, inject, Injector, ViewContainerRef} from '@angular/core';
import {asapScheduler, auditTime} from "rxjs";
import {OverlayManagerService} from "../services/overlay-manager.service";
import {RenderOverlayComponent} from "../components/render-overlay/render-overlay.component";
import {OverlayInstance} from "../models/overlay-instance";
import {BASE_OVERLAY_PROVIDERS, CUSTOM_OVERLAY_PROVIDERS, OVERLAY_ANIMATE_IN} from "../models/overlay-tokens";
import {OverlayContext} from "../models/overlay-context";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({selector: 'ngx-overlay-outlet'})
export class OverlayOutletDirective {

  private component?: ComponentRef<RenderOverlayComponent>;

  private baseProviders = inject(BASE_OVERLAY_PROVIDERS, {optional: true}) ?? [];

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: OverlayManagerService
  ) {
    this.manager.overlay$.pipe(
      auditTime(0, asapScheduler),
      takeUntilDestroyed()
    ).subscribe(x => this.renderOverlay(x.item, x.added));
  }

  renderOverlay(instance: OverlayInstance | undefined, added: boolean) {

    if (this.component) {
      this.component.instance.animate = !instance || !added;
      this.component.changeDetectorRef.markForCheck();
      this.component.destroy();
      this.component = undefined;
    }

    if (!instance) return;

    const parentInjector = instance.injector ?? this.viewContainer.injector;
    const customProviders = parentInjector.get(CUSTOM_OVERLAY_PROVIDERS, [], {optional: true});

    const injector = Injector.create({
      parent: parentInjector,
      providers: [
        {provide: OverlayContext, useValue: instance},
        {provide: OVERLAY_ANIMATE_IN, useValue: added},
        ...this.baseProviders,
        ...customProviders
      ],
      name: 'Overlay Injector'
    });

    this.component = this.viewContainer.createComponent<RenderOverlayComponent>(
      RenderOverlayComponent,
      {injector: injector}
    );

    this.component.changeDetectorRef.detectChanges();
    this.component.changeDetectorRef.markForCheck();
  }
}
