import {
  Component, ComponentRef, DestroyRef, ElementRef, inject, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {SnackbarInstance, SnackbarSilo} from "../../models";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SnackbarBaseComponent} from "../snackbar-base.component";

@Component({selector: 'ngx-snackbar-silo', template: '<ng-container #render/>'})
export class SnackbarSiloComponent implements OnInit {

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private silo = inject(SnackbarSilo);
  private destroyed = inject(DestroyRef);

  @ViewChild('render', {read: ViewContainerRef}) viewContainer!: ViewContainerRef;

  constructor() {
    this.element.classList.add('ngx-snackbar-silo');
    this.element.classList.add(this.silo.type);
  }

  ngOnInit() {
    this.silo.snackbars$.pipe(
      takeUntilDestroyed(this.destroyed)
    ).subscribe(x => this.updateView(x))
  }

  snackbars = new Map<SnackbarInstance<unknown>, ComponentRef<SnackbarBaseComponent<unknown>>>;

  private updateView(snackbars: SnackbarInstance<unknown>[]) {

    const toRemove = new Set(this.snackbars.keys());
    snackbars.forEach(x => toRemove.delete(x));

    // Remove old snackbars
    for (let oldInstance of toRemove) {
      const component = this.snackbars.get(oldInstance);
      if (!component) continue;
      const element = component.location.nativeElement as HTMLElement;
      element.classList.add('removed');
      component.destroy();
      this.snackbars.delete(oldInstance);
    }

    // Add / move snackbars
    for (let i = 0; i < snackbars.length; i++) {

      const instance = snackbars[i]!;
      const component = this.snackbars.get(instance);

      if (!component) {
        this.snackbars.set(instance, instance.render(this.viewContainer, i));
        continue;
      }

      const index = this.viewContainer.indexOf(component.hostView);
      if (index < 0 || index === i) continue;
      this.viewContainer.move(component.hostView, i);
    }
  }
}
