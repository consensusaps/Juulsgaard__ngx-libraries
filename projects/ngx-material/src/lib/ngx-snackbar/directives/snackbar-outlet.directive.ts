import {ComponentRef, Directive, inject, Injector, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SnackbarManagerService} from "../services/snackbar-manager.service";
import {Subscription} from "rxjs";
import {SnackbarSilo} from "../models/snackbar-silo";
import {SnackbarSiloComponent} from "../components/snackbar-silo/snackbar-silo.component";

@Directive({selector: 'snackbar-outlet'})
export class SnackbarOutletDirective implements OnDestroy, OnInit {

  private manager = inject(SnackbarManagerService);
  private viewContainer = inject(ViewContainerRef);

  private sub?: Subscription;
  private silos = new Map<SnackbarSilo, ComponentRef<SnackbarSiloComponent>>

  ngOnInit() {
    this.sub = this.manager.instructions$.subscribe(({item, change}) => {

      if (change === 'added') {
        const parentInjector = this.viewContainer.injector;
        const injector = Injector.create({
          parent: parentInjector,
          providers: [{provide: SnackbarSilo, useValue: item}],
          name: 'Snackbar Silo Injector'
        });

        const component = this.viewContainer.createComponent(SnackbarSiloComponent, {injector});
        this.silos.set(item, component);
        return;
      }

      const component = this.silos.get(item);
      component?.destroy();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
