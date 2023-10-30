import {ChangeDetectionStrategy, Component, Input, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInputComponent} from "@juulsgaard/ngx-forms";
import {
  asyncScheduler, BehaviorSubject, combineLatestWith, distinctUntilChanged, map, Observable, skip, throttleTime
} from "rxjs";
import {FormNode, isFormSelectNode, MultiSelectNode, SingleSelectNode} from "@juulsgaard/ngx-forms-core";
import {harmonicaAnimation, IconDirective, NgxAsyncAwaitDirective, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {ChipComponent} from "@juulsgaard/ngx-material";
import {
  MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import Fuse from "fuse.js";
import {isString} from "@juulsgaard/ts-tools";

@Component({
  selector: 'form-tag-list-input',
  standalone: true,
  imports: [
    CommonModule, ChipComponent, IconDirective, MatAutocompleteModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatTooltipModule, NgxAsyncAwaitDirective, NoClickBubbleDirective, ChipComponent
  ],
  animations: [harmonicaAnimation()],
  templateUrl: './tag-list-input.component.html',
  styleUrls: ['./tag-list-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListInputComponent extends BaseInputComponent<string[]|undefined, string[]> {

  @ViewChildren(ChipComponent) chips!: QueryList<ChipComponent>;

  private query$ = new BehaviorSubject('');
  get query() {return this.query$.value}
  set query(query: string) {this.query$.next(query)}

  private hasExternalItems = false;

  @Input('items') set itemsData(items: string[] | null | undefined) {
    if (!items) return;
    this.hasExternalItems = true;
    this.items = items;
  }

  protected _items$ = new BehaviorSubject<string[]>([]);
  items$ = this._items$.asObservable();
  options$: Observable<Options>;

  get items(): string[] {
    return this._items$.value
  };

  set items(items: string[]) {
    this._items$.next(items)
  }

  constructor() {
    super();
    const query$ = this.query$.pipe(
      throttleTime(500, asyncScheduler, {leading: true, trailing: true}),
      distinctUntilChanged()
    );

    const blacklist$ = this.inputValue$.pipe(
      map(x => new Set(x))
    );

    this.options$ = this.items$.pipe(
      combineLatestWith(blacklist$),
      map(([list, blacklist]) => blacklist.size ? list.filter(x => !blacklist.has(x)) : list),
      combineLatestWith(query$),
      map(([items, query]): Options => {
        if (!query.length) {
          return {
            options: items
          };
        }

        const searcher = new Fuse(items, {includeScore: true, isCaseSensitive: true});
        const result = searcher.search(query);
        const match = result.find(x => x.score === 0)?.item;
        const options = match
          ? result.filter(x => x.item !== match).map(x => x.item)
          : result.map(x => x.item);

        return {
          match,
          query: match ? undefined : query,
          options
        }
      })
    );
  }

  postprocessValue(value: string[]): string[] | undefined {
    return value.length < 1 ? undefined : value;
  }

  preprocessValue(value: string[] | undefined): string[] {
    return value ?? [];
  }

  override loadFormNode(n: FormNode<string[] | undefined>) {
    super.loadFormNode(n);

    if (!isFormSelectNode(n)) return;
    if (!n.multiple) return;
    const node = n as SingleSelectNode<string[], string> | MultiSelectNode<string[], string>;

    if (!node.items$) return;

    this.subscriptions.add(
      node.items$.pipe(
        skip(this.hasExternalItems ? 1 : 0)
      ).subscribe(x => this.items = x)
    );
  }

  removeTag(tag: string) {
    const index = this.inputValue.findIndex(x => x === tag);
    if (index < 0) return;
    const list = [...this.inputValue];
    list.splice(index, 1);
    this.inputValue = list;

    const input = this.inputElement?.nativeElement as HTMLInputElement|undefined;
    if (input) {
      input.focus();
      input.selectionStart = 0;
      input.selectionEnd = 0;
    }
  }

  @ViewChild(MatAutocompleteTrigger, {static: false}) trigger?: MatAutocompleteTrigger;
  onSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;

    if (value && isString(value)) {
      if (!this.inputValue.includes(value)) {
        this.inputValue = [...this.inputValue, value];
      }
    }

    this.query = '';
    const input = this.inputElement?.nativeElement as HTMLInputElement|undefined;
    if (input) input.value = '';
    setTimeout(() => this.trigger?.openPanel(), 500);
  }

  onBackspace(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (input.selectionStart == null) return;
    if (input.selectionEnd == null) return;
    if (input.selectionStart !== input.selectionEnd) return;
    if (input.selectionStart > 0) return;

    const chip = this.chips.toArray().at(-1);
    if (!chip) return;
    chip.focusRemove();
  }
}

interface Options {
  match?: string;
  query?: string;
  options: string[];
}
