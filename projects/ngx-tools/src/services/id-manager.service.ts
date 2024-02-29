import {inject, NgZone, Provider, signal, Type} from "@angular/core";
import {Clipboard} from "@angular/cdk/clipboard";

export abstract class IdManagerService {

  public static Provide(service: Type<IdManagerService>): Provider {
    return {provide: IdManagerService, useClass: service};
  }

  private _idCopyMode = signal(false);
  readonly idCopyMode = this._idCopyMode.asReadonly();

  private clipboard = inject(Clipboard);

  protected constructor() {
    const zone = inject(NgZone);

    zone.runOutsideAngular(() => {
      window.addEventListener('keydown', event => {

        if (this._idCopyMode()) {
          if (event.key !== 'Escape') return;
          if (!this._idCopyMode()) return;
          zone.run(() => this._idCopyMode.set(false));
          return;
        }

        if (event.altKey && event.shiftKey && event.key === 'f') {
          if (this._idCopyMode()) return;
          zone.run(() => this._idCopyMode.set(true));
          return;
        }

        if (event.altKey && event.key === 'c') {
          if (this._idCopyMode()) return;
          zone.run(() => this._idCopyMode.set(true));
          return;
        }
      });
    });
  }

  copyId(id: string) {
    this.clipboard.copy(id);
    this.onCopied();
    this._idCopyMode.set(false);
  }

  toggle(state?: boolean) {
    this._idCopyMode.update(x => state ?? !x);
  }

  protected abstract onCopied(): void;
}
