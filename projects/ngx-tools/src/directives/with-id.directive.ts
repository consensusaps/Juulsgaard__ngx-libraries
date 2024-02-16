import {DestroyRef, Directive, ElementRef, HostListener, inject, input} from '@angular/core';
import {Subscription} from "rxjs";
import {IdManagerService} from "../services";

@Directive({
  selector: '[withId]',
  standalone: true
})
export class WithIdDirective {

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const id = this.id();
    if (!id) return;
    if (!this.canCopy) return;

    event.stopImmediatePropagation();
    this.service?.copyId(id);
    return false;
  }

  sub: Subscription;
  id = input.required<string|undefined>();

  canCopy = false;


  private service = inject(IdManagerService, {optional: true});

  constructor() {
    const element = inject(ElementRef<HTMLElement>).nativeElement;

    this.sub = new Subscription();
    if (!this.service) return;

    this.sub.add(this.service.idCopyMode$.subscribe(x => {
      this.canCopy = x;
      element.classList.toggle('can-copy', x);
    }));

    this.sub.add(() => element.classList.remove('can-copy'));

    inject(DestroyRef).onDestroy(() => this.sub.unsubscribe());
  }

}
