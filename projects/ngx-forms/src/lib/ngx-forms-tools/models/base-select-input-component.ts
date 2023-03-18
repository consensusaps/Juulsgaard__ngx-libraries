import {Directive, Input} from "@angular/core";
import {BaseInputComponent} from "./base-input-component";
import {getSelectorFn, isString, MapFunc, Selection} from "@consensus-labs/ts-tools";
import {FormNode, isFormSelectNode, MultiSelectNode, SingleSelectNode} from "@consensus-labs/ngx-forms-core";
import {BehaviorSubject, skip} from "rxjs";

@Directive()
export abstract class BaseSelectInputComponent<TVal, TInputVal, TItem> extends BaseInputComponent<TVal, TInputVal> {

  private hasExternalItems = false;

  @Input('items') set itemsData(items: TItem[]|null|undefined) {
    if (!items) return;
    this.hasExternalItems = true;
    this.items = items;
  }

  protected _items$ = new BehaviorSubject<TItem[]>([]);

  items$ = this._items$.asObservable();
  get items(): TItem[] {return this._items$.value};
  set items(items: TItem[]) {this._items$.next(items)}

  get hidden() {
    return this.hideEmpty && this.items.length <= 0;
  }

  getValue!: MapFunc<TItem, TVal>;
  @Input() set bindValue(binding: string | Selection<TItem, TVal>) {
    // Typeless for backwards compatibility
    if (isString(binding)) {
      this.getValue = (x: any) => x[binding];
      return;
    }

    this.getValue = getSelectorFn(binding);
  };


  getLabel: MapFunc<TItem, string> = x => String(x);
  @Input() set bindLabel(binding: string | Selection<TItem, string> | undefined) {
    // Typeless for backwards compatibility
    if (isString(binding)) {
      this.getLabel = (x: any) => x[binding];
      return;
    }

    this.getLabel = binding ? getSelectorFn(binding) : x => String(x);
  };


  private _getOption?: MapFunc<TItem, string>;
  @Input() set bindOption(binding: string | Selection<TItem, string> | undefined) {
    // Typeless for backwards compatibility
    if (isString(binding)) {
      this._getOption = (x: any) => x[binding];
      return;
    }

    this._getOption = binding ? getSelectorFn(binding) : undefined;
  };
  get getOption() {return this._getOption ?? this.getLabel}

  @Input() multiple = false;

  @Input() clearable = true;
  @Input() hideEmpty = false;

  override loadFormNode(n: FormNode<TVal>) {
    super.loadFormNode(n);

    if (!isFormSelectNode(n)) return;
    const node = n as SingleSelectNode<TVal, TItem>|MultiSelectNode<TVal, TItem>;

    if (node.bindLabel) this.bindLabel = node.bindLabel;
    if (node.bindValue) this.bindValue = node.bindValue;
    if (node.bindOption) this.bindOption = node.bindOption;

    this.multiple = node.multiple ?? this.multiple;
    this.clearable = node.clearable ?? this.clearable;
    this.hideEmpty = node.hideWhenEmpty ?? this.hideEmpty;

    if (node.items$) {
      this.subscriptions.add(
        node.items$.pipe(
          skip(this.hasExternalItems ? 1 : 0)
        ).subscribe(this._items$)
      );
    }
  }

}
