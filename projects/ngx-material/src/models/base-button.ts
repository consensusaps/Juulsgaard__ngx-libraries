import {objToMap} from "@juulsgaard/ts-tools";
import {Directive, ElementRef, HostBinding, inject, Input, NgZone} from "@angular/core";
import {RippleConfig, RippleRenderer, RippleTarget} from "@angular/material/core";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {Platform} from "@angular/cdk/platform";
import {fromEvent, Subscription} from "rxjs";
import {Dispose} from "@juulsgaard/ngx-tools";

@Directive()
export class BaseButton implements RippleTarget {

  @HostBinding('class.disabled')
  @Input({transform: coerceBooleanProperty}) disabled = false;

  private _rippleRenderer: RippleRenderer;
  rippleConfig: RippleConfig = {};

  private _rippleDisabled = false;

  @Input({transform: coerceBooleanProperty})
  set rippleDisabled(disabled: boolean) {
    this._rippleDisabled = disabled;
  }
  get rippleDisabled() {return this.disabled || this._rippleDisabled};

  @HostBinding('tabIndex')
  get tabIndex() {return this.disabled ? -1 : 0}

  @Dispose private keydownSub?: Subscription;
  readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor() {

    this._rippleRenderer = new RippleRenderer(this, inject(NgZone), this.elementRef, inject(Platform));
    this._rippleRenderer.setupTriggerEvents(this.elementRef.nativeElement);

    this.elementRef.nativeElement.classList.add('ngx-button-base');
    const tagName = this.elementRef.nativeElement.tagName.toLowerCase().replaceAll('-', '');

    for (let attr of [tagName, ...this.elementRef.nativeElement.getAttributeNames()]) {
      const match = buttonClassLookup.get(attr.toLowerCase());
      if (!match) continue;
      this.elementRef.nativeElement.classList.add(...match);
      break;
    }

    const zone = inject(NgZone);

    zone.runOutsideAngular(() => {
      this.keydownSub = fromEvent<KeyboardEvent>(this.elementRef.nativeElement, 'keydown').subscribe(e => {
        if (e.key != 'Enter') return;
        zone.run(() => this.elementRef.nativeElement.click());
      });
    })
  }

  focus() {
    this.elementRef.nativeElement.focus();
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
