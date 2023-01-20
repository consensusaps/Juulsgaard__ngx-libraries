// noinspection JSNonASCIINames,NonAsciiCharacters

import {OnDestroy, OnInit} from "@angular/core";

export class DecoratorContext<T extends object = any> {

  private get globalInit() {
    this.setupInit();
    if (!this.prototype.ɵOnInitGlobalActions) this.prototype.ɵOnInitGlobalActions = [];
    return this.prototype.ɵOnInitGlobalActions;
  }

  private get globalDestroy() {
    this.setupDestroy();
    if (!this.prototype.ɵOnDestroyGlobalActions) this.prototype.ɵOnDestroyGlobalActions = [];
    return this.prototype.ɵOnDestroyGlobalActions;
  }

  private get localDestroy() {
    this.setupDestroy();
    if (!this.prototype.ɵOnDestroyActions) this.prototype.ɵOnDestroyActions = new WeakMap();
    return this.prototype.ɵOnDestroyActions;
  }

  constructor(private prototype: Prototype<T>) {
  }

  onInit(callback: InstanceAction<T>) {
    this.globalInit.push(callback);
  }

  onDestroy(callback: InstanceAction<T>) {
    this.globalDestroy.push(callback);
  }

  onLocalDestroy(instance: T, callback: InstanceAction<T>) {
    const map = this.localDestroy;
    if (!map.has(instance)) map.set(instance, []);
    map.get(instance)!.push(callback);
  }

  private setupDestroy() {
    if (this.prototype.ɵOnDestroy) return;
    const prototype = this.prototype;

    this.prototype.ɵOnDestroy = function (this: T) {
      for (let action of prototype.ɵOnDestroyGlobalActions ?? []) {
        action(this);
      }
      for (let action of prototype.ɵOnDestroyActions?.get(this) ?? []) {
        action(this);
      }
    }

    const oldDestroy = this.prototype.ngOnDestroy;

    this.prototype.ngOnDestroy = function (this: T) {
      oldDestroy?.call(this);
      prototype.ɵOnDestroy?.call(this);
    }
  }

  private setupInit() {
    if (this.prototype.ɵOnInit) return;
    const prototype = this.prototype;

    this.prototype.ɵOnInit = function (this: T) {
      for (let action of prototype.ɵOnInitGlobalActions ?? []) {
        action(this);
      }
    }

    const oldInit = this.prototype.ngOnInit;

    this.prototype.ngOnInit = function (this: T) {
      prototype.ɵOnInit?.call(this);
      oldInit?.call(this);
    }
  }

}

type InstanceAction<T> = (instance: T) => any;

interface OnDestroyPrototype<T extends object = any> extends Partial<OnDestroy> {
  ɵOnDestroy?: () => void;
  ɵOnDestroyActions?: WeakMap<T, InstanceAction<T>[]>;
  ɵOnDestroyGlobalActions?: InstanceAction<T>[];
}

interface OnInitPrototype<T extends object = any> extends Partial<OnInit> {
  ɵOnInit?: () => void;
  ɵOnInitGlobalActions?: InstanceAction<T>[];
}

type Prototype<T extends object> = OnDestroyPrototype<T> & OnInitPrototype<T>;
