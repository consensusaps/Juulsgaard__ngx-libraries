import {AfterViewInit, Directive, ElementRef, EventEmitter, NgZone, OnDestroy, Output} from '@angular/core';
import {fromEvent, Subscription} from "rxjs";

@Directive({selector: '[tap]', standalone: true})
export class TapDirective implements OnDestroy, AfterViewInit {

  @Output() tap = new EventEmitter<PointerEvent>();

  subs = new Subscription();
  pointer = new Map<number, number>();

  constructor(private element: ElementRef<HTMLElement>, private zone: NgZone) {

  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const start$ = fromEvent<PointerEvent>(this.element.nativeElement, 'pointerdown');
      const end$ = fromEvent<PointerEvent>(this.element.nativeElement, 'pointerup');

      this.subs.add(start$.subscribe(e => this.pointer.set(e.pointerId, Date.now())));

      this.subs.add(end$.subscribe(e => {
        const start = this.pointer.get(e.pointerId);
        if (!start) return;
        this.pointer.delete(e.pointerId);
        if (Date.now() - start < 200) {
          this.zone.run(() => this.tap.emit());
        }
      }));
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
