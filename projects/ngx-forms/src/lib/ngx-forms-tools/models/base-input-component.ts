import {
    booleanAttribute, computed, Directive, effect, ElementRef, HostBinding, inject, input, InputSignal,
    InputSignalWithTransform, model, ModelSignal, OnInit, Signal, signal, viewChild, viewChildren, WritableSignal
} from "@angular/core";
import {EMPTY, Observable, OperatorFunction, Subject, Subscribable, Subscription, switchMap} from "rxjs";
import {NgModel} from "@angular/forms";
import {ThemePalette} from '@angular/material/core';
import {FormNode, FormNodeEvent, hasRequiredField} from "@juulsgaard/ngx-forms-core";
import {alwaysErrorStateMatcher, neverErrorStateMatcher} from "./error-state-matchers";
import {FormContext} from "../services/form-context.service";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive()
export abstract class BaseInputComponent<TIn, TVal> implements OnInit {

    @HostBinding('class.ngx-form-input') private baseClass = true;

    protected inputElementRef: Signal<ElementRef<HTMLElement|HTMLTextAreaElement|HTMLInputElement>|undefined> =
      viewChild('input', {read: ElementRef});

    /** The main input element */
    protected inputElement: Signal<HTMLElement|HTMLTextAreaElement|HTMLInputElement|undefined> =
      computed(() => this.inputElementRef()?.nativeElement);
    /** A list of all NgModels in the input */
    private ngModels = viewChildren(NgModel);

    //<editor-fold desc="Required">
    readonly requiredIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'required'});
    readonly hideRequired: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
    protected required = computed(() => {
        if (this.hideRequired()) return false;
        if (this.requiredIn()) return true;
        const control = this.control();
        if (control) return hasRequiredField(control);
        return false;
    });
    //</editor-fold>

    //<editor-fold desc="Errors">
    /** The internal error state used for input level errors */
    protected inputError = signal<string|undefined>(undefined);

    readonly error = computed(() => this.inputError() ?? this.control()?.errorSignal());
    readonly hasError = computed(() => !!this.error());
    protected errorMatcher = computed(() => this.hasError() ? alwaysErrorStateMatcher : neverErrorStateMatcher)
    //</editor-fold>

    /** A controls that contains the input value / state */
    readonly control: InputSignal<FormNode<TIn> | FormNode<TIn|undefined> | undefined> = input<FormNode<TIn>|FormNode<TIn|undefined>|undefined>(
      undefined,
      {alias: 'control'}
    );

    //<editor-fold desc="External Value">
    readonly valueIn: ModelSignal<TIn | undefined> = model<TIn | undefined>(undefined, {alias: 'value'});

    readonly valueIn$: InputSignalWithTransform<
      Subject<TIn|undefined> | Observable<TIn|undefined> | undefined,
      Subject<TIn|undefined> | Subscribable<TIn|undefined> | undefined | null
    > = input(undefined, {
        alias: 'value$',
        transform: (value$: Subject<TIn|undefined>|Subscribable<TIn|undefined>|undefined|null) => {
            if (value$ == undefined) return undefined;
            if (value$ instanceof Subject) return value$;
            return new Observable<TIn|undefined>(subscriber => value$.subscribe(subscriber));
        }
    });

    private externalSubject = computed(() => {
        const ext$ = this.valueIn$();
        if (ext$ instanceof Subject) return ext$;
        return undefined;
    });

    protected externalValue: Signal<TIn|undefined>;
    //</editor-fold>

    //<editor-fold desc="Value">

    protected _value: WritableSignal<TVal>;

    /** The value representing the internal input state */
    protected get value() {return this._value()}
    /** The value representing the internal input state */
    protected set value(val: TVal) {
        this._value.set(val);

        const value = this.postprocessValue(val);
        this.lastValue = {val: value};

        const control = this.control();
        if (control) {
            control.setValue(value);
            if (control.pristine) control.markAsDirty();
        }

        this.control()?.setValue(value);
        this.externalSubject()?.next(value);
        this.valueIn.set(value);
    }
    //</editor-fold>

    //<editor-fold desc="Disabled">
    readonly disabledIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'disabled'});
    /** Marks that the input should be shown as disabled */
    protected disabled = computed(() => this.control()?.disabledSignal() || this.disabledIn());

    /** Disable hiding the input when it's disabled */
    readonly showDisabledIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'showDisabled'});
    protected showDisabled = computed(() => this.control()?.showDisabledField || this.showDisabledIn());

    /** Marks whether the input should be displayed or not */
    protected show = computed(() => this.showDisabled() || !this.disabled());
    //</editor-fold>

    //<editor-fold desc="Readonly">
    private formScope = inject(FormContext, {optional: true});

    readonly readonlyIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'readonly'});
    protected readonly = computed(() => {
        if (this.readonlyIn()) return true;
        if (this.formScope && this.formScope.readonly()) return true;
        const control = this.control();
        if (control && control.readonly) return true;
        return false;
    });
    //</editor-fold>

    //<editor-fold desc="Configuration">

    /** The input label */
    readonly labelIn: InputSignal<string | undefined> = input<string|undefined>(undefined, {alias: 'label'});
    protected label = computed(() => this.labelIn() ?? this.control()?.label);

    /** A placeholder text, if not set the label will be used */
    readonly placeholderIn: InputSignal<string | undefined> = input<string|undefined>(undefined, {alias: 'placeholder'});
    protected placeholder = computed(() => this.placeholderIn() ?? this.label() ?? '');

    /** Input to tell the browser what type of autocomplete the input should use */
    readonly autocompleteIn: InputSignal<string | undefined> = input<string|undefined>(undefined, {alias: 'autocomplete'});
    protected autocomplete = computed(() => this.autocompleteIn() ?? this.control()?.autocomplete);

    /** Focus the input when it's first created */
    readonly autofocusIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'autofocus'});
    protected autofocus = computed(() => this.autocompleteIn() || this.control()?.autoFocus);

    /** Add a tooltip with additional information about the input */
    readonly tooltipIn: InputSignal<string | undefined> = input<string|undefined>(undefined, {alias: 'tooltip'});
    protected tooltip = computed(() => this.tooltipIn() ?? this.control()?.tooltip);

    /** Set the theme color for the input */
    readonly colorIn: InputSignal<ThemePalette> = input<ThemePalette>('primary', {alias: 'color'});
    protected color = computed(() => this.colorIn());

    /** Change the material input style */
    readonly appearanceIn: InputSignal<MatFormFieldAppearance> = input<MatFormFieldAppearance>('outline', {alias: 'appearance'});
    protected appearance = computed(() => this.appearanceIn());

    /** Hide the required asterisk */
    readonly directionIn: InputSignal<"ltr" | "rtl" | "auto" | undefined> = input<'ltr'|'rtl'|'auto'|undefined>(undefined, {alias: 'direction'});
    protected direction = computed(() => this.directionIn());
    //</editor-fold>

    private lastValue?: {val: TIn|undefined};

    protected constructor() {
        const element = inject(ElementRef<HTMLElement>).nativeElement;
        effect(() => element.classList.toggle('hidden', !this.show()));
        effect(() => element.classList.toggle('read-only', this.readonly()));

        this._value = signal(this.getInitialValue());

        const valueSignals$ = toObservable(this.valueIn$).pipe(mapObservableToSignal());
        const valueSignals = toSignal(valueSignals$, {initialValue: undefined});

        this.externalValue = computed(() => {
            const control = this.control();
            if (control) return control.valueSignal();

            const asyncValue = valueSignals();
            if (asyncValue) return asyncValue();

            return this.valueIn();
        });

        effect(() => {
            const value = this.externalValue();

            if (this.lastValue) {
                const lastValue = this.lastValue.val;
                this.lastValue = undefined;
                if (lastValue === value) return;
            }

            this._value.set(this.preprocessValue(value));
        }, {allowSignalWrites: true});

        // Handle control resets
        toObservable(this.control).pipe(
          switchMap(x => x?.reset$ ?? EMPTY),
          takeUntilDestroyed()
        ).subscribe(() => {
            this.ngModels().forEach(x => {
                x.control.markAsPristine();
                x.control.markAsUntouched();
            });
        });

        // Handle control actions
        toObservable(this.control).pipe(
          switchMap(x => x?.actions$ ?? EMPTY),
          takeUntilDestroyed()
        ).subscribe(action => this.handleAction(action));
    }

    ngOnInit() {
        if (this.autofocus()) {
            setTimeout(() => this.focus());
        }
    }

    //<editor-fold desc="Actions">
    /** Focus the input */
    focus() {
        this.inputElement()?.focus();
    }

    /** Select the contents of the input */
    select() {
        const input = this.inputElement();
        if (!input) return;
        if (!('select' in input)) return;
        input.select();
    }
    //</editor-fold>

    //<editor-fold desc="Value processing">
    /**
     * Processes the value from the FormNode before it is assigned to the inputValue prop
     * @param value The value to processed
     */
    abstract preprocessValue(value: TIn|undefined): TVal;

    /**
     * Processes the value generated by the input component and returns the value that is stored in the FormNode
     * @param value The value to be processed
     */
    abstract postprocessValue(value: TVal): TIn|undefined;

    /**
     * Generate an initial value for the internal state
     */
    getInitialValue(): TVal {
        return this.preprocessValue(undefined);
    }
    //</editor-fold>

    /** Handle events dispatched from the FormNode */
    protected handleAction(event: FormNodeEvent) {
        switch (event) {
            case FormNodeEvent.Focus:
                this.focus();
                break;
            case FormNodeEvent.Select:
                this.select();
                break;
        }
    }
}

function mapObservableToSignal<T>(): OperatorFunction<Observable<T>|undefined, Signal<T|undefined>|undefined> {
    return (source) => new Observable<Signal<T|undefined>>(subscriber => {
        let itemSub: Subscription|undefined;

        const sub = source.subscribe({
            next: val$ => {
                itemSub?.unsubscribe();
                if (!val$) {
                    itemSub = undefined;
                    subscriber.next(undefined);
                    return;
                }
                const sig = signal<T|undefined>(undefined);
                itemSub = val$.subscribe(x => sig.set(x));
                subscriber.next(sig);
            }
        });

        return () => {
          sub.unsubscribe();
          itemSub?.unsubscribe();
        };
    });
}
