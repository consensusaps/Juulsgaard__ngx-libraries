import {booleanAttribute, computed, Directive, input, InputSignal, Signal} from "@angular/core";
import {BaseInputComponent} from "./base-input-component";
import {getSelectorFn, isString, MapFunc, Selection} from "@juulsgaard/ts-tools";
import {isFormSelectNode, MultiSelectNode, SingleSelectNode} from "@juulsgaard/ngx-forms-core";
import {of, startWith, switchMap} from "rxjs";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Directive()
export abstract class BaseSelectInputComponent<TIn, TVal, TItem> extends BaseInputComponent<TIn, TVal> {

  protected selectControl: Signal<SingleSelectNode<TIn, TItem> | MultiSelectNode<TIn, TItem> | undefined> = computed(
    () => {
      const control = this.control();
      if (control && isFormSelectNode(control)) return control as SingleSelectNode<TIn, TItem> | MultiSelectNode<TIn, TItem>;
      return undefined
    }
  );

  private controlItems$ = toObservable(this.selectControl).pipe(
    switchMap(x => x?.items$.pipe(startWith(undefined)) ?? of(undefined))
  );
  private controlItems = toSignal(this.controlItems$);
  readonly itemsIn: InputSignal<TItem[] | undefined> = input<TItem[] | undefined>(undefined, {alias: 'items'});
  protected items: Signal<TItem[]> = computed(() => this.itemsIn() ?? this.controlItems() ?? []);

  protected empty = computed(() => this.items().length <= 0);

  readonly hideEmptyIn = input(false, {transform: booleanAttribute, alias: 'hideEmpty'});
  protected hideEmpty = computed(() => this.selectControl()?.hideWhenEmpty || this.hideEmptyIn());
  protected hidden = computed(() => this.hideEmpty() && this.empty());

  readonly multipleIn = input(false, {transform: booleanAttribute, alias: 'multiple'});
  protected multiple = computed(() => this.selectControl()?.multiple ?? this.multipleIn());

  readonly clearableIn = input(false, {transform: booleanAttribute, alias: 'clearable'});
  protected clearable = computed(() => this.selectControl()?.clearable || this.clearableIn());

  //<editor-fold desc="Bindings">
  readonly bindValue = input(
    (x: TItem) => x as unknown as TIn,
    {
      transform: (binding: string | Selection<TItem, TIn> | undefined | null): MapFunc<TItem, TIn> => {
        // Typeless for backwards compatibility
        if (binding == null) return (x: TItem) => x as unknown as TIn;
        if (isString(binding)) return (x: any) => x[binding];
        return getSelectorFn(binding);
      }
    }
  );
  protected getValue = computed(() => this.selectControl()?.bindValue ?? this.bindValue());

  readonly bindLabel = input(
    (x: TItem) => String(x),
    {
      transform: (binding: string | Selection<TItem, string> | undefined | null) => {
        if (binding == null) return (x: TItem) => String(x);
        // Typeless for backwards compatibility
        if (isString(binding)) return (x: any) => x[binding];
        return getSelectorFn(binding);
      }
    }
  );

  protected getLabel = computed(() => this.selectControl()?.bindLabel ?? this.bindLabel());

  readonly bindOption = input(undefined, {
    transform: (binding: string | Selection<TItem, string> | undefined | null): MapFunc<TItem, string> | undefined => {
      if (binding == null) return undefined;
      // Typeless for backwards compatibility
      if (isString(binding)) return (x: any) => x[binding];
      return getSelectorFn(binding);
    }
  })

  protected getOption = computed(() => this.selectControl()?.bindOption ?? this.bindOption() ?? this.getLabel());
  //</editor-fold>

}
