import {
    ChangeDetectorRef, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, inject, Input, OnDestroy, OnInit,
    Output, QueryList, ViewChild, ViewChildren
} from "@angular/core";
import {BehaviorSubject, combineLatest, Observable, Subject, Subscribable, Subscription, Unsubscribable} from "rxjs";
import {ControlContainer, NgModel} from "@angular/forms";
import {ErrorStateMatcher, ThemePalette} from '@angular/material/core';
import {distinctUntilChanged, map} from "rxjs/operators";
import {FormNode, FormNodeEvent, hasRequiredField, InputTypes} from "@juulsgaard/ngx-forms-core";
import {alwaysErrorStateMatcher, neverErrorStateMatcher} from "./error-state-matchers";
import {FormContext} from "../services/form-context.service";
import {MatFormFieldAppearance, MatPrefix, MatSuffix} from "@angular/material/form-field";

@Directive()
export abstract class BaseInputComponent<TVal, TInputVal> implements OnInit, OnDestroy {

    @HostBinding('class.ngx-form-input') private baseClass = true;

    subscriptions = new Subscription();
    initialised = false;

    /** The main input element */
    @ViewChild('input') inputElement?: ElementRef<HTMLElement|HTMLTextAreaElement|HTMLInputElement>;
    /** A list of all NgModels in the input */
    @ViewChildren(NgModel) ngModels!: QueryList<NgModel>;
    /** A material form suffix if one exists */
    @ContentChild(MatSuffix) suffixChild?: MatSuffix;
    /** A material form prefix if one exists */
    @ContentChild(MatPrefix) prefixChild?: MatPrefix;

    @Input() showAsRequired = false;
    private _fieldRequired = false;

    get required() {
        return this._fieldRequired || this.showAsRequired
    };

    private inputError$ = new BehaviorSubject<string|undefined>(undefined);
    /** The internal error state used for input level errors */
    protected set inputError(error: string|undefined) {
        this.inputError$.next(error);
    }
    protected get inputError() {return this.inputError$.value}

    hasError$!: Observable<boolean>;
    errorText$!: Observable<string|undefined>;
    errorMatcher$!: Observable<ErrorStateMatcher>;

    /** A controls that contains the input value / state */
    control: FormNode<TInputVal>;

    //<editor-fold desc="Control Binds">
    controlSub?: Subscription;

    /** Indicates that a value has been sent to FormNode, and that the following update should be ignored */
    pendingValue = false;

    /** The name of a control for automatic resolution. Cannot be changed after init */
    @Input() public controlName?: string;

    _externalControl?: FormNode<TVal>;
    @Input('control') set externalControl(control: FormNode<TVal> | undefined) {
        if (control === this._externalControl) return;
        this.controlSub?.unsubscribe();

        this._externalControl = control;

        if (!this.initialised) return;

        if (!control) {
            this.externalControlTeardown();
            return;
        }

        this.externalControlSetup(control);
    };

    get externalControl() {
        return this._externalControl
    }

    /** Setup external controls and setup bindings */
    private externalControlSetup(control: FormNode<TVal>) {

        this._fieldRequired = hasRequiredField(control);

        this.controlSub = new Subscription();

        // Listen to control events
        this.controlSub.add(control.actions$.subscribe(e => this.handleEvents(e)));


        const inputError$ = this.inputError$.pipe(distinctUntilChanged());

        // Map error state from control errors and internal errors
        this.hasError$ = combineLatest([control.hasError$, inputError$]).pipe(
          map(([hasError, error]) => hasError || !!error)
        );
        this.errorText$ = combineLatest([control.error$, inputError$]).pipe(
          map(([controlError, inputError]) => inputError ?? controlError)
        );
        this.errorMatcher$ = this.hasError$.pipe(map( b => b ? alwaysErrorStateMatcher : neverErrorStateMatcher));

        // Force input to show errors when one is present
        this.errorMatcher$ = this.hasError$.pipe(map( b => b ? alwaysErrorStateMatcher : neverErrorStateMatcher));

        this.loadFormNode(control);
        this.changes.detectChanges();

        // Map control values to internal state
        this.controlSub.add(control.value$.subscribe(x => {
            if (this.pendingValue) {
                this.pendingValue = false;
                return;
            }

            this.externalValue = x;
            this.changes.detectChanges();
        }));

        // Listen for reset events from control and reset the internal control state
        this.controlSub.add(control.reset$.subscribe(() => {
            this.ngModels.forEach(x => {
                x.control.markAsPristine();
                x.control.markAsUntouched();
            });
            this.control.markAsPristine();
            this.control.markAsUntouched();
            this.changes.detectChanges();
        }));

        // Sync with the disabled state
        this.controlSub.add(control.disabled$.subscribe(x => {
            this._controlDisabled = x;
            this.changes.detectChanges();
        }));
    }

    /** Reset control related values to default */
    private externalControlTeardown() {
        this._fieldRequired = false;
        this._controlDisabled = false;

        const inputError$ = this.inputError$.pipe(distinctUntilChanged());
        this.hasError$ = inputError$.pipe(map(error => !!error));
        this.errorText$ = inputError$;
        this.errorMatcher$ = this.hasError$.pipe(map( b => b ? alwaysErrorStateMatcher : neverErrorStateMatcher));
    }

    //</editor-fold>

    //<editor-fold desc="Value Binds">
    @Input() set value(val: TVal) {
        this.externalValue = val;
    }

    @Output() valueChange = new EventEmitter<TVal>();

    valueSub?: Unsubscribable;
    _value$?: Subject<TVal>|Subscribable<TVal>;
    @Input() set value$(value$: Subject<TVal>|Subscribable<TVal>) {
        this.valueSub?.unsubscribe();
        this.valueSub = value$.subscribe({next: x => {
            this.externalValue = x;
            this.changes.detectChanges();
        }});
        this._value$ = value$;
    }
    //</editor-fold>

    _externalValue?: TVal;

    //<editor-fold desc="Value Processing">

    /** Value representing the value of the control / value input */
    set externalValue(val: TVal | undefined) {
        if (val == this._externalValue) return;
        this._externalValue = val;
        this._inputValue$.next(this.preprocessValue(val));
        this.control.setValue(this.inputValue);
    }

    /** Value representing the value of the control / value input */
    get externalValue() {
        return this._externalValue
    }

    _inputValue$ = new BehaviorSubject<TInputVal>(this.preprocessValue(undefined));
    inputValue$ = this._inputValue$.pipe(distinctUntilChanged());

    /** The value representing the internal input state */
    set inputValue(val: TInputVal) {
        if (val == this.inputValue) return;

        this._inputValue$.next(val);
        this._externalValue = this.postprocessValue(val);

        if (this.externalControl) {
            this.pendingValue = true;
            this.externalControl.setValue(this._externalValue);
            if (this.externalControl.pristine) this.externalControl.markAsDirty();
        }

        if (this.valueChange.observed) {
            this.valueChange.emit(this._externalValue);
        }

        if (this._value$ && 'next' in this._value$) {
            this._value$?.next(this._externalValue);
        }
    }

    /** The value representing the internal input state */
    get inputValue() {
        return this._inputValue$.value
    }
    //</editor-fold>

    private _controlDisabled = false;
    /** Marks that the input should be shown as disabled */
    get isDisabled() {
        return this.disable === undefined ? this._controlDisabled : this.disable;
    }

    /** Marks whether the input should be displayed or not */
    get show() {
        return !this.isDisabled || !!this.showDisabled;
    }

    @HostBinding('class.hidden')
    get dontShow() {
        return !this.show;
    }

    //<editor-fold desc="Configuration">

    /** The input label */
    @Input() public label?: string;
    /** A placeholder text, if not set the label will be used */
    @Input() public placeholder?: string;
    /** Input to tell the browser what type of autocomplete the input should use */
    @Input() public autocomplete?: string;
    /** Focus the input when it's first created */
    @Input() public autofocus?: boolean;
    /** Disable the input */
    @Input() public disable?: boolean;
    /** Add a tooltip with additional information about the input */
    @Input() public tooltip?: string;
    /** Disable hiding the input when it's disabled */
    @Input() public showDisabled?: boolean;
    /** Set the theme color for the input */
    @Input() public color: ThemePalette = 'primary';
    /** Change the material input style */
    @Input() public appearance: MatFormFieldAppearance = 'outline';
    /** Hide the required asterisk */
    @Input() public hideRequired = false;
    @Input() public direction?: 'ltr'|'rtl'|'auto';

    /** Set the input as read-only */
    @Input('readonly') set readonlyState(readonly: boolean|undefined) {this._readonly = readonly};
    _scopeReadonly = false;
    _readonly?: boolean;

    /** Indicates that the user shouldn't be able to edit the input */
    @HostBinding('class.read-only')
    get readonly(): boolean {return this._readonly === undefined ? this._scopeReadonly : this._readonly}
    //</editor-fold>

    protected changes = inject(ChangeDetectorRef);
    private controlContainer = inject(ControlContainer, {optional: true, host: true, skipSelf: true});
    private formScope = inject(FormContext, {optional: true});

    protected constructor() {
        this.control = new FormNode(InputTypes.Generic, this.preprocessValue(undefined));
        this.subscriptions.add(this.control.value$.subscribe(x => this.inputValue = x));

        // Use control teardown to set up default error bindings
        this.externalControlTeardown();
    }

    ngOnInit(): void {
        if (this._externalControl) {
            this.externalControlSetup(this._externalControl);
        }

        if (this.formScope) {
            this.subscriptions.add(this.formScope.readonly$.subscribe(x => {
                this._scopeReadonly = x;
                this.changes.detectChanges();
            }));
        }

        this.initialised = true;

        // Use the control name to bind the control from a parent control container
        if (this.controlName) {
            const control = this.controlContainer?.control?.get(this.controlName);
            if (control instanceof FormNode) this.externalControl = control;
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.controlSub?.unsubscribe();
        this.valueSub?.unsubscribe();
    }

    /** Focus the input */
    focus() {
        this.inputElement?.nativeElement?.focus();
    }

    select() {
        const input = this.inputElement?.nativeElement;
        if (!input) return;
        if (!('select' in input)) return;
        input.select();
    }

    /**
     * Processes the value from the FormNode before it is assigned to the inputValue prop
     * @param value The value to processed
     */
    abstract preprocessValue(value: TVal|undefined): TInputVal;

    /**
     * Processes the value generated by the input component and returns the value that is stored in the FormNode
     * @param value The value to be processed
     */
    abstract postprocessValue(value: TInputVal): TVal;

    /** Apply config from FormNode */
    protected loadFormNode(node: FormNode<TVal>) {
        this.label = this.label ?? node.label;
        this.autocomplete = this.autocomplete ?? node.autocomplete;
        this.tooltip = this.tooltip ?? node.tooltip;
        this.showDisabled = this.showDisabled ?? node.showDisabledField;
        this.autofocus = this.autofocus ?? node.autoFocus;
        this._readonly = this._readonly ?? node.readonly;

        this.afterInit()
    }

    protected afterInit() {
        if (this.autofocus) {
            setTimeout(() => this.focus());
        }
    }

    /** Handle events dispatched from the FormNode */
    protected handleEvents(event: FormNodeEvent) {
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
