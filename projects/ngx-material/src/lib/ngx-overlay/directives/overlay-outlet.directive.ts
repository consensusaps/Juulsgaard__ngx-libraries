import {ChangeDetectorRef, ComponentRef, Directive, inject, Injector, OnInit, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {OverlayManagerService} from "../services/overlay-manager.service";
import {RenderOverlayComponent} from "../components/render-overlay/render-overlay.component";
import {OverlayInstance} from "../models/overlay-instance";
import {BASE_OVERLAY_PROVIDERS, OVERLAY_ANIMATE_IN} from "../models/overlay-tokens";
import {OverlayContext} from "../models/overlay-context";

@Directive({selector: 'ngx-overlay-outlet', standalone: true})
export class OverlayOutletDirective implements OnInit {

  private sub?: Subscription;
  private component?: ComponentRef<RenderOverlayComponent>;

  baseProviders = inject(BASE_OVERLAY_PROVIDERS, {optional: true});

  constructor(
    private viewContainer: ViewContainerRef,
    private manager: OverlayManagerService,
    private changes: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sub = this.manager.overlay$.subscribe(x => this.renderOverlay(x.item, x.added));
  }

  renderOverlay(instance: OverlayInstance | undefined, added: boolean) {

    if (this.component) {
      this.component.instance.animate = !instance || !added;
      this.component.changeDetectorRef.detectChanges();
      this.component.destroy();
    }

    if (!instance) return;

    const injector = Injector.create({
      parent: instance.injector ?? this.viewContainer.injector,
      providers: [
        {provide: OverlayContext, useValue: instance},
        {provide: OVERLAY_ANIMATE_IN, useValue: added},
        ...(this.baseProviders ?? [])
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
