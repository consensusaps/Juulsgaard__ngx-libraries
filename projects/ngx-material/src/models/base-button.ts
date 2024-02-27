import {objToMap} from "@juulsgaard/ts-tools";
import {booleanAttribute, Directive, effect, ElementRef, inject, input, NgZone} from "@angular/core";
import {RippleConfig, RippleRenderer, RippleTarget} from "@angular/material/core";
import {Platform} from "@angular/cdk/platform";
import {fromEvent} from "rxjs";
import {Form} from "@juulsgaard/ngx-forms-core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive()
export class BaseButton implements RippleTarget {

  readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  disabled = input(false, {transform: booleanAttribute});
  rippleDisabledIn = input(false, {transform: booleanAttribute, alias: 'rippleDisabled'});
  tabIndex = input(0);

  private _rippleRenderer: RippleRenderer;
  readonly rippleConfig: RippleConfig = {};

  get rippleDisabled() {return this.disabled() || this.rippleDisabledIn()};

  constructor() {

    effect(() => this.element.tabIndex = this.disabled() ? -1 : this.tabIndex());
    effect(() => this.element.classList.toggle('disabled', this.disabled()));

    const zone = inject(NgZone);
    this._rippleRenderer = new RippleRenderer(this, zone, this.element, inject(Platform));
    this._rippleRenderer.setupTriggerEvents(this.element);

    this.element.classList.add('ngx-button-base');
    const tagName = this.element.tagName.toLowerCase().replaceAll('-', '');

    for (let attr of [tagName, ...this.element.getAttributeNames()]) {
      const match = buttonClassLookup.get(attr.toLowerCase());
      if (!match) continue;
      this.element.classList.add(...match);
      break;
    }

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

@Directive()
export class BaseAnchor extends BaseButton {

}

const baseIcon = 'ngx-icon-button-base';

const buttonClasses = {
  'ngxIconButton': [baseIcon, 'ngx-icon-button'],
  'ngxRaisedIconButton': [baseIcon, 'ngx-raised-icon-button'],
}

const buttonClassLookup = objToMap(buttonClasses, (_, x) => x.toLowerCase());
