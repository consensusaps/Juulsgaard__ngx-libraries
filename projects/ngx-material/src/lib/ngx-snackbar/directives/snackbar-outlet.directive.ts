import {ComponentRef, Directive, inject, Injector, ViewContainerRef} from '@angular/core';
import {SnackbarManagerService} from "../services";
import {asapScheduler, auditTime} from "rxjs";
import {SnackbarSilo} from "../models";
import {SnackbarSiloComponent} from "../components/snackbar-silo/snackbar-silo.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({selector: 'ngx-snackbar-outlet'})
export class SnackbarOutletDirective {

  private manager = inject(SnackbarManagerService);
  private viewContainer = inject(ViewContainerRef);

  private silos = new Map<SnackbarSilo, ComponentRef<SnackbarSiloComponent>>

  constructor() {
    this.manager.instructions$.pipe(
      auditTime(0, asapScheduler),
      takeUntilDestroyed()
    ).subscribe(({item, change}) => {

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

}
