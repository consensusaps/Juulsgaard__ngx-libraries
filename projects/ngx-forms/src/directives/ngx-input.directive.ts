import {
  booleanAttribute, computed, Directive, effect, ElementRef, forwardRef, inject, input, InputSignal, model, ModelSignal,
  NgZone, OnDestroy, output, signal
} from '@angular/core';
import {FormNode} from "@juulsgaard/ngx-forms-core";
import {MAT_FORM_FIELD, MatFormFieldControl} from "@angular/material/form-field";
import {fromEvent, Subject} from "rxjs";
import {AutofillMonitor} from "@angular/cdk/text-field";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
export class NgxInputDirective<T> implements MatFormFieldControl<T | undefined>, OnDestroy {

  static nextId = 0;
  protected uid = `ngx-input-${NgxInputDirective.nextId++}`;

  readonly idIn = input<string | undefined>(undefined, {alias: 'id'});
  protected readonly _id = computed(() => this.idIn() ?? this.uid);
  get id() {
    return this._id()
  }

  readonly inputValue: ModelSignal<T | undefined> = model<T | undefined>(undefined);
  readonly node: InputSignal<FormNode<T> | undefined> = input<FormNode<T>>();

  private readonly _value = computed(() => {
    const node = this.node();
    if (!node) return this.inputValue();
    return node.state();
  });

  readonly touched = output();

  readonly ngControl = null;

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private autofillMonitor = inject(AutofillMonitor);

  protected _inMdcFormField = inject(MAT_FORM_FIELD, {optional: true}) != null;
  private lastValue?: { val: T | undefined };

  constructor() {

    this.autofillMonitor.monitor(this.element)
      .subscribe(x => this._autofilled.set(x.isAutofilled));

    effect(() => this.element.id = this._id());

    effect(() => {
      if (!('required' in this.element)) return;
      this.element.required = this._required();
    });

    effect(() => {
      if (!('placeholder' in this.element)) return;
      this.element.placeholder = this._placeholder();
    });

    effect(() => {
      const value = this._value();

      if (this.lastValue) {
        const lastValue = this.lastValue.val;
        this.lastValue = undefined;
        if (lastValue === value) return;
      }

      this.writeValue(value);
    });

    effect(() => {
      this._id();
      this._value();
      this._placeholder();
      this._focused();
      this._empty();
      this._shouldLabelFloat();
      this._required();
      this._disabled();
      this._errorState();
      this._autofilled();
      this.update();
    });

    const zone = inject(NgZone);
    zone.runOutsideAngular(() => {
      fromEvent<InputEvent>(this.element, 'input').pipe(takeUntilDestroyed()).subscribe(x => {
        const value = this.readValue();
        this.lastValue = {val: value};
        zone.run(() => this.value = value);
      });

      fromEvent(this.element, 'focus').pipe(takeUntilDestroyed()).subscribe(() => zone.run(() => this.onFocus()));
      fromEvent(this.element, 'blur').pipe(takeUntilDestroyed()).subscribe(() => zone.run(() => this.onBlur()));
    });
  }

  protected readValue(): T | undefined {
    return this.element.value ?? undefined;
  }

  protected writeValue(value: T | undefined) {
    this.element.value = value ?? null;
  }

  ngOnDestroy() {
    this.autofillMonitor.stopMonitoring(this.element);
  }

  get value() {
    return this._value()
  }

  set value(value: T | undefined) {
    this.node()?.setValue(value);
    this.inputValue.set(value);
  }

  private readonly _stateChanges = new Subject<void>();
  readonly stateChanges = this._stateChanges.asObservable();

  protected update() {
    this._stateChanges.next()
  };

  readonly placeholderIn = input<string | undefined>(undefined, {alias: 'placeholder'})
  protected readonly _placeholder = computed(() => this.placeholderIn() ?? '');
  get placeholder() {
    return this._placeholder()
  };

  protected readonly _focused = signal(false);
  get focused() {
    return this._focused()
  };

  protected readonly _empty = computed(() => !this._autofilled() && !this._value());
  get empty() {
    return this._empty()
  };

  protected readonly _shouldLabelFloat = computed(() => this._focused() || !this._empty())
  get shouldLabelFloat() {
    return this._shouldLabelFloat()
  };

  readonly requiredIn = input(false, {transform: booleanAttribute, alias: 'required'});
  protected readonly _required = computed(() => this.requiredIn() || this.node()?.required || false);
  get required() {
    return this._required()
  };

  readonly disabledIn = input(false, {transform: booleanAttribute, alias: 'disabled'});
  protected readonly _disabled = computed(() => this.disabledIn() || this.node()?.disabled() || false);
  get disabled() {
    return this._disabled()
  };

  readonly nodeErrorState = computed(() => {
    const node = this.node();
    if (!node) return false;
    if (!node.hasError()) return false;
    return node.touched() || node.changed();
  });
  readonly errorStateIn = input(false, {transform: booleanAttribute, alias: 'showError'});
  protected readonly _errorState = computed(() => this.errorStateIn() || this.nodeErrorState());
  get errorState() {
    return this._errorState()
  };

  readonly controlType = 'ngx-input';

  private readonly _autofilled = signal(false);
  get autofilled() {
    return this._autofilled()
  };


  readonly userAriaDescribedByIn = input<string|undefined>(undefined, {alias: 'aria-describedby'});
  protected readonly _userAriaDescribedBy = computed(() => this.userAriaDescribedByIn() ?? '');
  get userAriaDescribedBy() {return this._userAriaDescribedBy()};

  onContainerClick(event: MouseEvent): void {
    if (this.focused) return;
    this.focus();
  }

  setDescribedByIds(ids: string[]): void {
    if (ids.length) {
      this.element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this.element.removeAttribute('aria-describedby');
    }
  }

  focus(options?: FocusOptions): void {
    this.element.focus(options);
  }

  private onFocus() {
    if (this.focused) return;
    this._focused.set(true);
  }

  private onBlur() {
    if (!this.focused) return;
    this._focused.set(false);
    this.node()?.markAsTouched();
    this.touched.emit();
  }
}
