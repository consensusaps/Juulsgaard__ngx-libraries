import {Directive, effect, forwardRef, inject, NgZone} from '@angular/core';
import {MAT_FORM_FIELD, MatFormFieldControl} from "@angular/material/form-field";
import {fromEvent} from "rxjs";
import {AutofillMonitor} from "@angular/cdk/text-field";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NgxFormFieldDirective} from "./ngx-form-field.directive";
import {FocusOptions} from "@angular/cdk/a11y";

@Directive({
  selector: 'input[ngxInput], textarea[ngxInput], [contentEditable][ngxInput]',
  standalone: true,
  providers: [{provide: MatFormFieldControl, useExisting: forwardRef(() => NgxInputDirective)}],
  host: {
    // MDC classes for styling
    '[class.mdc-text-field__input]': '_inMdcFormField',
    '[class.mat-mdc-form-field-input-control]': '_inMdcFormField',
  }
})
export class NgxInputDirective<T> extends NgxFormFieldDirective<T> {

  protected _inMdcFormField = inject(MAT_FORM_FIELD, {optional: true}) != null;
  private autofillMonitor = inject(AutofillMonitor);

  constructor() {
    super();

    this.autofillMonitor.monitor(this.element)
      .subscribe(x => {
        this._autofilled.set(x.isAutofilled);
        const value = this.element.value ?? undefined;
        this.setValue(value);
      });

    effect(() => this.element.id = this._id());

    effect(() => {
      if (!('required' in this.element)) return;
      this.element.required = this._required();
    });

    effect(() => {
      if (!('placeholder' in this.element)) return;
      this.element.placeholder = this._placeholder();
    });

    const zone = inject(NgZone);
    zone.runOutsideAngular(() => {
      fromEvent<InputEvent>(this.element, 'input').pipe(takeUntilDestroyed()).subscribe(x => {
        const value = this.element.value ?? undefined;
        zone.run(() => this.setValue(value));
      });

      fromEvent(this.element, 'focus').pipe(takeUntilDestroyed()).subscribe(() => zone.run(() => this.onFocus()));
      fromEvent(this.element, 'blur').pipe(takeUntilDestroyed()).subscribe(() => zone.run(() => this.onBlur()));
    });
  }

  ngOnDestroy() {
    this.autofillMonitor.stopMonitoring(this.element);
  }

  focus(options: FocusOptions | undefined): void {
    this.element.focus(options);
  }

  protected isEmpty(value: T | undefined): boolean {
    if (value == null) return true;
    return value === '';
  }

  protected writeValue(value: T | undefined): void {
    this.element.value = value ?? null;
  }

}
