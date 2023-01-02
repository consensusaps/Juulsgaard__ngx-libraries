import {Directive, EventEmitter, HostListener, Input, NgZone, OnDestroy, Output} from '@angular/core';
import {combineLatest, fromEvent, Observable, startWith, Subscription, timer} from "rxjs";
import {filter, first, map, tap} from "rxjs/operators";

@Directive({
  selector: '[longTap]',
  standalone: true,
  host: {
    'class': 'long-tap',
    '[class.long-tap-active]': 'active',
    '[class.long-tap-completed]': 'completed',
    '[style.--long-tap-duration]': 'tapDuration + "ms"'
  }
})
export class LongTapDirective implements OnDestroy {

  // Default 5 based on the CDK dragStartThreshold
  private static readonly moveThreshold = 5;

  @Input() tapDuration = 500;
  @Input() longTapDisabled = false;
  @Output() longTap = new EventEmitter<void>();

  eventStartPos?: { x: number, y: number };
  active = false;
  completed = false;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.zone.runOutsideAngular(() => {
      if (this.longTapDisabled) return;
      this.eventStartPos = this.getPosition(event);
      this.onStart(
        fromEvent<MouseEvent>(window, 'mousemove', {passive: true}),
        fromEvent<MouseEvent>(window, 'mouseup', {passive: true})
      );
    })
  }

  @HostListener('touchdown', ['$event'])
  onTouchDown(event: TouchEvent) {
   this.zone.runOutsideAngular(() => {
     if (this.longTapDisabled) return;
     this.eventStartPos = this.getPosition(event);
     this.onStart(
       fromEvent<MouseEvent>(window, 'touchmove', {passive: true}),
       fromEvent<MouseEvent>(window, 'touchend', {passive: true})
     );
   })
  }

  sub?: Subscription;

  constructor(private zone: NgZone) {
  }

  onStart(move: Observable<MouseEvent | TouchEvent>, end: Observable<MouseEvent | TouchEvent>) {

    const moved = move.pipe(
      filter(event => {
        if (!this.eventStartPos) return true;
        const pos = this.getPosition(event);
        const distanceX = Math.abs(pos.x - this.eventStartPos.x);
        const distanceY = Math.abs(pos.y - this.eventStartPos.y);
        return distanceX + distanceY >= LongTapDirective.moveThreshold;
      }),
      first(),
      map(() => true),
      startWith(false)
    );

    const ended = end.pipe(
      first(),
      map(() => true),
      startWith(false)
    );

    const timerFinish = timer(this.tapDuration).pipe(
      first(),
      tap(() => this.completed = true),
      map(() => true),
      startWith(false)
    );

    const state = combineLatest([moved, ended, timerFinish]).pipe(
      // Take the first element where the event has moved or ended
      first(([moved, ended]) => moved || ended),
      // Emit event if timer had finished
      map(([_, __, finished]) => finished)
    )

    this.zone.run(() => {
      this.active = true;
      this.completed = false;
      this.sub?.unsubscribe();

      this.sub = state.subscribe(finished => {
        this.active = false;
        this.completed = false;
        if (finished) this.longTap.emit();
      });
    });
  }

  getPosition(event: MouseEvent | TouchEvent) {
    const pos = event instanceof TouchEvent ? event.touches[0] ?? event.changedTouches[0] : event;
    return {x: pos.clientX + window.scrollX, y: pos.clientY + window.scrollY};
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
