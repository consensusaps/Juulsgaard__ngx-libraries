import {Directive, HostListener, Input, NgZone, OnDestroy} from '@angular/core';
import {fromEvent, merge, Subscription} from "rxjs";
import {filter, first, map, tap} from "rxjs/operators";
import {MatMenuTrigger} from "@angular/material/menu";

@Directive({selector: '[contextMenu]', standalone: true})
export class ContextMenuDirective implements OnDestroy {

  @Input('contextMenu') trigger?: MatMenuTrigger;
  @Input('triggerElement') element?: HTMLElement;
  @Input('menuData') data?: unknown;
  @Input() disableMenu?: boolean;

  sub?: Subscription;

  constructor(private zone: NgZone) {
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }


  @HostListener('contextmenu', ['$event'])
  onMenu(event: MouseEvent) {
    if (event.shiftKey || event.metaKey || event.ctrlKey) return;
    if (this.disableMenu === true) return;
    if (!this.trigger) return;
    if (!this.element) return;

    event.stopPropagation();
    event.preventDefault();

    this.openMenu(event.clientX, event.clientY);
  }

  openMenu(x: number, y: number) {
    this.element!.style.left = `${x}px`;
    this.element!.style.top = `${y}px`;
    if (this.data !== undefined) this.trigger!.menuData = this.data;
    this.trigger!.openMenu();

    // Listen to events and close the context menu if the page is scrolled, or the user right clicks
    // Stop listening for events if the menu is otherwise closed
    this.zone.runOutsideAngular(() => {
      this.sub?.unsubscribe();

      this.sub = merge(
        this.trigger!.menuClosed.pipe(
          map(() => false)
        ),
        fromEvent(window, 'scroll').pipe(
          map(() => true)
        ),
        fromEvent<MouseEvent>(window, 'contextmenu').pipe(
          filter(e => !e.shiftKey && !e.metaKey && !e.ctrlKey),
          tap(e => e.preventDefault()),
          map(() => true)
        )
      ).pipe(
        first(),
        filter(b => b)
      ).subscribe(() => this.zone.run(() => this.trigger?.closeMenu()))
    })
  }
}
