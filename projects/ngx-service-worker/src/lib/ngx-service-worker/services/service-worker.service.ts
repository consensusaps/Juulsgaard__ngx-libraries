import {ApplicationRef, NgZone} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {BehaviorSubject, combineLatest, firstValueFrom, Observable, startWith} from "rxjs";
import {filter, first, map, tap} from "rxjs/operators";
import {permanentCache} from "@consensus-labs/rxjs-tools";

export class ServiceWorkerService {

  /** The app is in a broken state */
  brokenState$: Observable<boolean>;
  /** The app has an active SW */
  serviceWorkerReady$: Observable<boolean>;
  /** A new version is ready for install */
  updateReady$: Observable<boolean>;
  /** New version is downloading */
  downloading$: Observable<boolean>;

  /** The user can check for updates manually */
  canCheckForUpdate$: Observable<boolean>;
  /** The app is checking for updates */
  checking$: Observable<boolean>;

  /** True when the Service Worker is not in default state */
  working$: Observable<boolean>;

  constructor(private workerUpdates: SwUpdate, private appRef: ApplicationRef, private zone: NgZone) {

    this.serviceWorkerReady$ = appRef.isStable.pipe(
      first(x => x),
      map(() => workerUpdates.isEnabled),
      startWith(false),
      permanentCache()
    );

    this.updateReady$ = workerUpdates.versionUpdates.pipe(
      first(x => x.type === 'VERSION_READY'),
      map(() => true),
      startWith(false),
      permanentCache()
    );

    this.downloading$ = workerUpdates.versionUpdates
      .pipe(
        filter(x => x.type === "VERSION_DETECTED" || x.type === "VERSION_READY"),
        map(x => x.type === "VERSION_DETECTED"),
        startWith(false),
        permanentCache()
      );

    this.brokenState$ = workerUpdates.unrecoverable.pipe(
      first(),
      tap(e => console.error('Service worker reached an unrecoverable state:', e.reason)),
      map(() => true),
      startWith(false),
      permanentCache()
    );

    this.checking$ = combineLatest([this._checkingForUpdate$, this.downloading$])
      .pipe(map(([checking, downloading]) => checking && !downloading));

    this.canCheckForUpdate$ = combineLatest([
      this.serviceWorkerReady$,
      this.updateReady$,
      this.downloading$,
      this._updateCooldown$,
      this._checkingForUpdate$
    ])
      .pipe(map(([hasServiceWorker, ready, downloading, cooldown, checking]) => hasServiceWorker && !ready && !downloading && !cooldown && !checking));

    this.working$ = combineLatest([this.updateReady$, this.downloading$, this.checking$])
      .pipe(map(([ready, downloading, checking]) => ready || downloading || checking));
  }

  //<editor-fold desc="Check for Update">
  private _updateCooldown$ = new BehaviorSubject(false);
  private _checkingForUpdate$ = new BehaviorSubject(false);

  async checkForUpdate() {
    if (!this.workerUpdates.isEnabled) return;
    if (!await firstValueFrom(this.canCheckForUpdate$)) return;

    this._updateCooldown$.next(true);
    this.zone.runOutsideAngular(
      () => setTimeout(
        () => this.zone.run(() => this._updateCooldown$.next(false)
        ),
        60000
      )
    )

    this._checkingForUpdate$.next(true);

    try {
      await this.workerUpdates.checkForUpdate();
    } finally {
      this._checkingForUpdate$.next(false);
    }
  }

  //</editor-fold>

  async updateApp() {
    if (!this.workerUpdates.isEnabled) return;
    const updatePending = await firstValueFrom(this.updateReady$);
    if (updatePending) {
      await this.workerUpdates.activateUpdate();
    }
    location.reload();
  }
}
