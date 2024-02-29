import {
  booleanAttribute, Directive, effect, ElementRef, inject, input, InputSignal, InputSignalWithTransform, NgZone
} from "@angular/core";
import {RippleConfig, RippleRenderer, RippleTarget} from "@angular/material/core";
import {Platform} from "@angular/cdk/platform";
import {fromEvent} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {applyButtonClasses} from "./button-classes";
import {elementClassManager} from "@juulsgaard/ngx-tools";
import {NgxThemeColor} from "../../../models";

@Directive()
export class BaseButton implements RippleTarget {

  readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly rippleDisabledIn: InputSignalWithTransform<boolean, unknown> = input(
    false,
    {transform: booleanAttribute, alias: 'rippleDisabled'}
  );
  readonly active: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly tabIndex: InputSignal<number> = input(0);
  readonly color: InputSignalWithTransform<string[], NgxThemeColor | undefined | null> = input([], {
    transform: (color: NgxThemeColor | undefined | null) => {
      if (color == null) return [];
      return ['ngx-color', `ngx-color-${color}`];
    }
  });
  readonly background: InputSignalWithTransform<string[], NgxThemeColor | undefined | null> = input([], {
    transform: (color: NgxThemeColor | undefined | null) => {
      if (color == null) return [];
      return ['ngx-background', `ngx-background-${color}`];
    }
  });

  private _rippleRenderer: RippleRenderer;
  readonly rippleConfig: RippleConfig = {};

  get rippleDisabled() {
    return this.disabled() || this.rippleDisabledIn()
  };

  constructor() {
    this.element.role = 'button';
    this.element.classList.add('ngx-button-base');
    applyButtonClasses(this.element);

    effect(() => this.element.tabIndex = this.disabled() ? -1 : this.tabIndex());
    effect(() => this.element.classList.toggle('disabled', this.disabled()));
    effect(() => this.element.classList.toggle('active', this.active()));

    elementClassManager(this.color);
    elementClassManager(this.background);

    const zone = inject(NgZone);
    this._rippleRenderer = new RippleRenderer(this, zone, this.element, inject(Platform));
    this._rippleRenderer.setupTriggerEvents(this.element);

    zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(this.element, 'keydown').pipe(
        takeUntilDestroyed()
      ).subscribe(e => {
        if (e.key != 'Enter') return;
        zone.run(() => this.element.click());
      });
    });
  }

  focus() {
    this.element.focus();
  }
}

