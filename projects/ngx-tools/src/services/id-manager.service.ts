import {inject, NgZone, Provider, Type} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Clipboard} from "@angular/cdk/clipboard";

export abstract class IdManagerService {

  public static Provide(service: Type<IdManagerService>): Provider {
    return {provide: IdManagerService, useClass: service};
  }

  public idCopyMode$ = new BehaviorSubject<boolean>(false);

  private clipboard = inject(Clipboard);

  protected constructor() {
    const zone = inject(NgZone);

    zone.runOutsideAngular(() => {
      window.addEventListener('keydown', event => {

        if (this.idCopyMode$.value) {
          if (event.key !== 'Escape') return;
          if (!this.idCopyMode$.value) return;
          zone.run(() => this.idCopyMode$.next(false));
          return;
        }

        if (event.ctrlKey && event.shiftKey && event.key === 'f') {
          if (this.idCopyMode$.value) return;
          zone.run(() => this.idCopyMode$.next(true));
          return;
        }

        if (event.altKey && event.key === 'c') {
          if (this.idCopyMode$.value) return;
          zone.run(() => this.idCopyMode$.next(true));
          return;
        }
      });
    });
  }

  copyId(id: string) {
    this.clipboard.copy(id);
    this.onCopied();
    this.idCopyMode$.next(false);
  }

  toggle() {
    this.idCopyMode$.next(!this.idCopyMode$.value);
  }

  protected abstract onCopied(): void;
}
