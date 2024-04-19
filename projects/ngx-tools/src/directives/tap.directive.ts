import {Directive, ElementRef, EventEmitter, inject, NgZone, Output} from '@angular/core';
import {fromEvent, merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({selector: '[tap]', standalone: true})
export class TapDirective {

  @Output() tap = new EventEmitter<PointerEvent>();

  private pointer = new Map<number, number>();

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private zone = inject(NgZone);

  constructor() {
    const start$ = fromEvent<PointerEvent>(this.element, 'pointerdown');
    const end$ = fromEvent<PointerEvent>(this.element, 'pointerup');
    const cancel$ = fromEvent<PointerEvent>(this.element, 'pointercancel');
    const left$ = fromEvent<PointerEvent>(this.element, 'pointerleave');

    this.zone.runOutsideAngular(() => {
      start$.pipe(takeUntilDestroyed())
        .subscribe(e => this.pointer.set(e.pointerId, Date.now()));

      end$.pipe(takeUntilDestroyed()).subscribe(e => {
        const start = this.pointer.get(e.pointerId);
        if (!start) return;
        this.pointer.delete(e.pointerId);
        if (Date.now() - start < 200) {
          this.zone.run(() => this.tap.emit());
        }
      });

      merge(cancel$, left$).pipe(takeUntilDestroyed())
        .subscribe(e => this.pointer.delete(e.pointerId));
    });
  }
}
