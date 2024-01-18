import {Injectable} from '@angular/core';
import {OverlayToken} from "./overlay.model";
import {notNull, ObservableStack} from "@juulsgaard/rxjs-tools";
import {fromEvent, Observable, share, Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class OverlayService {

  private static readonly BASE_Z_INDEX = 600;
  private readonly scheduler = new ObservableStack<OverlayToken>();
  private readonly escape$: Observable<OverlayToken>;
  private readonly subscriptions = new Map<OverlayToken, Subscription>();

  constructor() {

    this.scheduler.empty$.subscribe(empty => document.documentElement.classList.toggle('no-scroll', !empty));

    this.escape$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
      filter(e => e.code === 'Escape'),
      map(() => this.scheduler.top),
      notNull(),
      share()
    );
  }

  /**
   * Generate an overlay token that is placed on underneath all existing tokens
   * @return token - The generated Overlay Token
   */
  queueOverlay(): OverlayToken {
    const currentZIndex = this.scheduler.bottom?.zIndex ?? OverlayService.BASE_Z_INDEX;

    const token = new OverlayToken(
      currentZIndex - 2,
      this.escape$
    );

    const sub = token.disposed$.subscribe(() => this.removeToken(token));
    this.registerToken(token, sub);
    this.scheduler.addToBottom(token);

    return token;
  }

  /**
   * Generate an overlay token that is placed on top of all existing tokens
   * @return token - The generated Overlay Token
   */
  pushOverlay(): OverlayToken {

    const currentZIndex = this.scheduler.top?.zIndex ?? OverlayService.BASE_Z_INDEX;

    const token = new OverlayToken(
      currentZIndex + 5,
      this.escape$
    );

    const sub = token.disposed$.subscribe(() => this.removeToken(token));
    this.registerToken(token, sub);

    this.scheduler.push(token);
    return token;
  }

  private registerToken(token: OverlayToken, subscription: Subscription) {
    if (this.subscriptions.has(token)) throw Error("The same overlay token can't be registered twice");
    this.subscriptions.set(token, subscription);
  }

  private removeToken(token: OverlayToken) {
    const sub = this.subscriptions.get(token);
    if (!sub) return;
    sub.unsubscribe();
    this.subscriptions.delete(token);
    this.scheduler.removeItem(token);
  }

}
