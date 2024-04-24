import {
  booleanAttribute, computed, DestroyRef, Directive, effect, ElementRef, inject, input, InputSignal,
  InputSignalWithTransform, model, ModelSignal, output, signal, untracked
} from '@angular/core';
import {FormNode} from "@juulsgaard/ngx-forms-core";
import {MatFormFieldControl} from "@angular/material/form-field";
import {Subject} from "rxjs";

@Directive()
export abstract class NgxFormFieldDirective<T> implements MatFormFieldControl<T | undefined> {

  static nextId = 0;
  protected uid = `ngx-input-${NgxFormFieldDirective.nextId++}`;

  readonly idIn = input<string | undefined>(undefined, {alias: 'id'});
  protected readonly _id = computed(() => this.idIn() ?? this.uid);
  get id() {
    return this._id()
  }

  readonly ngxModel: ModelSignal<T | undefined> = model<T | undefined>(undefined);
  readonly control: InputSignal<FormNode<T> | FormNode<T|undefined> | undefined> = input<FormNode<T> | FormNode<T|undefined>>();

  private readonly _value = computed(() => {
    const node = this.control();
    if (!node) return this.ngxModel();
    return node.state();
  });

  readonly touched = output();

  readonly ngControl = null;

  protected element = inject(ElementRef<HTMLElement>).nativeElement;

  private lastValue?: { val: T | undefined };

  protected constructor() {

    effect(() => {
      const value = this._value();

      if (this.lastValue) {
        const lastValue = this.lastValue.val;
        this.lastValue = undefined;
        if (lastValue === value) return;
      }

      untracked(() => this.writeValue(value));
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

    inject(DestroyRef).onDestroy(() => this._stateChanges.complete());
  }

  protected abstract writeValue(value: T | undefined): void;

  protected setValue(value: T|undefined) {
    this.lastValue = {val: value};
    this.value = value;
  }

  get value() {
    return this._value()
  }

  set value(value: T | undefined) {
    this.control()?.setValue(value);
    this.ngxModel.set(value);
  }

  private readonly _stateChanges = new Subject<void>();
  readonly stateChanges = this._stateChanges.asObservable();

  protected update() {
    this._stateChanges.next()
  };

  readonly placeholderIn: InputSignal<string | undefined> = input<string | undefined>(undefined, {alias: 'placeholder'})
  protected readonly _placeholder = computed(() => this.placeholderIn() ?? '');
  get placeholder() {
    return this._placeholder()
  };

  protected readonly _focused = signal(false);
  get focused() {
    return this._focused()
  };

  protected readonly _empty = computed(() => !this._autofilled() && this.isEmpty(this._value()));
  get empty() {
    return this._empty()
  };

  protected abstract isEmpty(value: T | undefined): boolean;

  protected readonly _shouldLabelFloat = computed(() => this._focused() || !this._empty())
  get shouldLabelFloat() {
    return this._shouldLabelFloat()
  };

  readonly requiredIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'required'});
  protected readonly _required = computed(() => this.requiredIn() || this.control()?.required || false);
  get required() {
    return this._required()
  };

  readonly disabledIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'disabled'});
  protected readonly _disabled = computed(() => this.disabledIn() || this.control()?.disabled() || false);
  get disabled() {
    return this._disabled()
  };

  readonly nodeErrorState = computed(() => {
    const node = this.control();
    if (!node) return false;
    if (!node.hasError()) return false;
    return node.touched() || node.changed();
  });
  readonly errorStateIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'showError'});
  protected readonly _errorState = computed(() => this.errorStateIn() || this.nodeErrorState());
  get errorState() {
    return this._errorState()
  };

  readonly controlType = 'ngx-input';

  protected readonly _autofilled = signal(false);
  get autofilled() {
    return this._autofilled()
  };


  readonly userAriaDescribedByIn: InputSignal<string | undefined> = input<string|undefined>(undefined, {alias: 'aria-describedby'});
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

  abstract focus(options?: FocusOptions): void;

  protected onFocus() {
    if (this.focused) return;
    this._focused.set(true);
  }

  protected onBlur() {
    if (!this.focused) return;
    this._focused.set(false);
    this.control()?.markAsTouched();
    this.touched.emit();
  }
}
