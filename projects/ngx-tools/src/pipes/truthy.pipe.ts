import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, ɵisSubscribable} from '@angular/core';
import {Subscribable, Unsubscribable} from "rxjs";

@Pipe({
  name: 'truthy',
  pure: false,
  standalone: true
})

export class TruthyPipe implements PipeTransform, OnDestroy {

  private asyncValue;
  private obj?: Promise<any> | Subscribable<any>;
  private subscription?: Unsubscribable;
  private startup = false;

  constructor(private ref: ChangeDetectorRef) {
    this.asyncValue = this.parseValue(false);
  }

  transform(value: Promise<any>): boolean
  transform(value: Subscribable<any>): boolean
  transform(value: any): boolean
  transform(value: null | undefined): boolean
  transform(value: Promise<any> | Subscribable<any> | any | null | undefined): boolean {

    if (value == null) {
      this.reset();
      return false;
    }

    if (ɵisSubscribable(value)) {
      if (value !== this.obj) {
        this.obj = value;
        this.subscription?.unsubscribe();
        this.startup = true;
        this.subscription = value.subscribe({next: x => this.setValue(x, value)});
        this.startup = false;
      }
      return this.asyncValue;
    }

    this.reset();

    if (value instanceof Promise) {
      if (value !== this.obj) {
        this.obj = value;
        this.startup = true;
        value.then(
          x => this.setValue(x, value),
          () => this.setValue(false, value)
        );
        this.startup = false;
      }
      return this.asyncValue;
    }

    return this.parseValue(value);
  }

  private reset() {
    this.subscription?.unsubscribe();
  }

  private setValue(value: any, obj: Promise<any> | Subscribable<any>) {
    if (obj !== this.obj) return;

    const val = this.parseValue(value);
    if (val === this.asyncValue) return;

    this.asyncValue = this.parseValue(value);
    if (this.startup) return;
    this.ref.detectChanges();
  }

  ngOnDestroy() {
    this.reset();
  }

  protected parseValue(x: any): boolean {
    return !!x;
  }
}
