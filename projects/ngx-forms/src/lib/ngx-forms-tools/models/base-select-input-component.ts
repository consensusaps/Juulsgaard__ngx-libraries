import {
  booleanAttribute, computed, Directive, input, InputSignal, InputSignalWithTransform, Signal
} from "@angular/core";
import {BaseInputComponent} from "./base-input-component";
import {getSelectorFn, isString, MapFunc, Selection} from "@juulsgaard/ts-tools";
import {FormNode, FormSelectNode, isFormSelectNode} from "@juulsgaard/ngx-forms-core";
import {of, startWith, switchMap} from "rxjs";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive()
export abstract class BaseSelectInputComponent<TValue, TItem, TMultiple extends boolean, TState>
  extends BaseInputComponent<TMultiple extends true ? TValue[] : TValue, TState> {

  abstract readonly multiple: TMultiple;

  declare readonly control: InputSignal<
    FormNode<TMultiple extends true ? TValue[] : TValue> |
    FormNode<(TMultiple extends true ? TValue[] : TValue) | undefined> |
    FormSelectNode<TValue, TItem, TMultiple> |
    undefined
  >;

  protected selectControl: Signal<FormSelectNode<TValue, TItem, TMultiple> | undefined> = computed(
    () => {
      const control = this.control();
      if (control && isFormSelectNode(control) && control.multiple === this.multiple) {
        return control as FormSelectNode<TValue, TItem, TMultiple> | undefined;
      }
      return undefined
    }
  );

  private controlItems$ = toObservable(this.selectControl).pipe(
    switchMap(x => x?.items$.pipe(startWith(undefined)) ?? of(undefined))
  );
  private controlItems = toSignal(this.controlItems$);
  readonly itemsIn: InputSignal<TItem[] | undefined> = input<TItem[] | undefined>(undefined, {alias: 'items'});
  protected items: Signal<TItem[]> = computed(() => this.itemsIn() ?? this.controlItems() ?? []);

  protected mappedItems: Signal<FormSelectValue<TItem, TValue>[]> = computed(() => {
    const mapValue = this.getValue();
    const mapOption = this.getOption();
    return this.items().map(x => new FormSelectValue(x, mapValue?.(x), mapOption?.(x)));
  });


  protected empty = computed(() => this.items().length <= 0);

  readonly hideEmptyIn: InputSignalWithTransform<boolean, unknown> = input(
    false,
    {transform: booleanAttribute, alias: 'hideEmpty'}
  );
  protected hideEmpty = computed(() => this.selectControl()?.hideWhenEmpty || this.hideEmptyIn());
  protected hidden = computed(() => this.hideEmpty() && this.empty());

  readonly clearableIn: InputSignalWithTransform<boolean, unknown> = input(
    false,
    {transform: booleanAttribute, alias: 'clearable'}
  );
  protected clearable = computed(() => this.selectControl()?.clearable || this.clearableIn());

  readonly selectGroupsIn: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  protected selectGroups = computed(() => this.selectGroupsIn());

  constructor() {
    super();
    this._value.set(this.preprocessValue(undefined));
  }

  //<editor-fold desc="Value Mapping">
  readonly bindValue: InputSignalWithTransform<
    MapFunc<TItem, TValue>|undefined,
    string | Selection<TItem, TValue> | undefined | null
  > = input(
    undefined, {
      transform: (binding: string | Selection<TItem, TValue> | undefined | null): MapFunc<TItem, TValue> => {
        // Typeless for backwards compatibility
        if (binding == null) return (x: TItem) => x as unknown as TValue;
        if (isString(binding)) return (x: any) => x[binding];
        return getSelectorFn(binding);
      }
    }
  );

  private controlBindValue = computed(() => {
    const control = this.selectControl();
    if (!control) return undefined;
    return getSelectorFn(control.bindValue);
  });

  protected getValue: Signal<MapFunc<TItem, TValue>|undefined> = computed(() => this.controlBindValue() ?? this.bindValue());

  protected mapValue(item: TItem): TValue {
    const map = this.getValue();
    if (map) return map(item);
    return String(item) as TValue;
  }
  //</editor-fold>

  //<editor-fold desc="Label Mapping">
  readonly bindLabel: InputSignalWithTransform<
    MapFunc<TItem, string> | undefined,
    string | Selection<TItem, string> | undefined | null
  > = input(
    undefined, {
      transform: (binding: string | Selection<TItem, string> | undefined | null): MapFunc<TItem, string>|undefined => {
        if (binding == null) return undefined;
        // Typeless for backwards compatibility
        if (isString(binding)) return (x: any) => x[binding];
        return getSelectorFn(binding);
      }
    }
  );

  private controlBindLabel = computed(() => {
    const control = this.selectControl();
    if (!control?.bindLabel) return undefined;
    return getSelectorFn(control.bindLabel);
  });

  protected getLabel: Signal<MapFunc<TItem, string>|undefined> = computed(() => this.controlBindLabel() ?? this.bindLabel());

  protected mapLabel(item: TItem) {
    const map = this.getLabel();
    if (map) return map(item);
    return String(item);
  }
  //</editor-fold>

  //<editor-fold desc="Option Mapping">
  readonly bindOption: InputSignalWithTransform<
    MapFunc<TItem, string> | undefined,
    string | Selection<TItem, string> | undefined | null
  > = input(undefined, {
    transform: (binding: string | Selection<TItem, string> | undefined | null): MapFunc<TItem, string> | undefined => {
      if (binding == null) return undefined;
      // Typeless for backwards compatibility
      if (isString(binding)) return (x: any) => x[binding];
      return getSelectorFn(binding);
    }
  });

  private controlBindOption = computed(() => {
    const control = this.selectControl();
    if (!control?.bindOption) return undefined;
    return getSelectorFn(control.bindOption);
  });

  protected getOption: Signal<MapFunc<TItem, string>|undefined> = computed(() => this.controlBindOption() ?? this.bindOption() ?? this.getLabel());

  protected mapOption(item: TItem) {
    const map = this.getOption();
    if (map) return map(item);
    return String(item);
  }
  //</editor-fold>

  readonly groupByIn: InputSignalWithTransform<
    MapFunc<TItem, string> | undefined,
    string | Selection<TItem, string> | undefined | null
  > = input(undefined, {
    alias: 'groupBy',
    transform: (grouping: string | Selection<TItem, string> | undefined | null): MapFunc<TItem, string> | undefined => {
      if (grouping == null) return undefined;
      // Typeless for backwards compatibility
      if (isString(grouping)) return (x: any) => x[grouping];
      return getSelectorFn(grouping);
    }
  });

  protected groupBy: Signal<MapFunc<TItem, string> | undefined> = computed(() => this.groupByIn());

  override getInitialValue(): TState {
    return undefined as TState;
  }
}

export class FormSelectValue<T, TId> {
  readonly id: TId;
  readonly name: string;

  constructor(readonly value: T, id?: TId, name?: string) {
    this.id = id ?? String(value) as TId;
    this.name = name ?? String(this.id);
  }
}

@Directive()
export abstract class BaseMultiSelectInputComponent<TValue, TItem, TState>
  extends BaseSelectInputComponent<TValue, TItem, true, TState> {

  override readonly multiple = true;

  override readonly control: InputSignal<
    FormNode<TValue[]> |
    FormNode<TValue[]|undefined> |
    FormSelectNode<TValue, TItem, true> |
    undefined
  > = input<
    FormNode<TValue[]> |
    FormNode<TValue[]|undefined> |
    FormSelectNode<TValue, TItem, true>
  >();

}

@Directive()
export abstract class BaseSingleSelectInputComponent<TValue, TItem, TState>
  extends BaseSelectInputComponent<TValue, TItem, false, TState> {

  override readonly multiple = false;

  override readonly control: InputSignal<
    FormNode<TValue> |
    FormNode<TValue|undefined> |
    FormSelectNode<TValue, TItem, false> |
    FormSelectNode<TValue|undefined, TItem, false> |
    undefined
  > = input<
    FormNode<TValue> |
    FormNode<TValue|undefined> |
    FormSelectNode<TValue, TItem, false> |
    FormSelectNode<TValue|undefined, TItem, false>
  >();
}
