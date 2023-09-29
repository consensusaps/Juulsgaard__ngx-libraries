import {objToMap} from "@juulsgaard/ts-tools";
import {Directive, ElementRef, HostBinding, inject, Input, NgZone} from "@angular/core";
import {RippleConfig, RippleRenderer, RippleTarget} from "@angular/material/core";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {Platform} from "@angular/cdk/platform";

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

  constructor() {
    const elementRef = inject(ElementRef<HTMLElement>);
    this._rippleRenderer = new RippleRenderer(this, inject(NgZone), elementRef, inject(Platform));
    this._rippleRenderer.setupTriggerEvents(elementRef.nativeElement);

    elementRef.nativeElement.classList.add('ngx-button-base');
    const tagName = elementRef.nativeElement.tagName.toLowerCase().replaceAll('-', '');
    console.log(tagName)

    for (let attr of [tagName, ...elementRef.nativeElement.getAttributeNames()]) {
      const match = buttonClassLookup.get(attr.toLowerCase());
      if (!match) continue;
      elementRef.nativeElement.classList.add(...match);
      break;
    }
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
