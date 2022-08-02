import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Scheduler} from "@consensus-labs/rxjs-tools";
import {OverlayToken} from "./overlay.model";


@Injectable({providedIn: 'root'})
export class OverlayService {

  baseOverlayZIndex = 600;
  scheduler = new Scheduler<OverlayToken>();

  constructor(zone: NgZone) {

    this.scheduler.handleUpdates(items => document.documentElement.classList.toggle('no-scroll', !!items.length));
    this.scheduler.handleItemUpdates((x, i) => x.isTop$.next(i === 0));

    zone.runOutsideAngular(() => {
      window.addEventListener('keydown', event => {
        if (event.code === 'Escape' && !this.scheduler.empty) {
          zone.run(() => this.scheduler.front?.escape$.next());
        }
      });
    })
  }

  queueOverlay(): OverlayToken {
    const token = new OverlayToken(
      (this.scheduler.back?.zIndex ?? this.baseOverlayZIndex) - 2,
      x => this.removeToken(x)
    );
    this.scheduler.enqueue(token);
    return token;
  }

  pushOverlay(): OverlayToken {
    const token = new OverlayToken(
      (this.scheduler.front?.zIndex ?? this.baseOverlayZIndex) + 5,
      x => this.removeToken(x)
    );
    this.scheduler.push(token);
    return token;
  }

  private removeToken(token: OverlayToken) {
    this.scheduler.removeItem(token);
  }

}
