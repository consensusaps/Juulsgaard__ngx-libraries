import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, input, InputSignal, InputSignalWithTransform, Signal,
  signal, viewChild, viewChildren
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInputComponent} from "@juulsgaard/ngx-forms";
import {of, startWith, switchMap} from "rxjs";
import {isFormSelectNode, MultiSelectNode, SingleSelectNode} from "@juulsgaard/ngx-forms-core";
import {
  harmonicaAnimation, IconDirective, NgxDragEvent, NgxDragModule, NgxDragService, NoClickBubbleDirective, throttleSignal
} from "@juulsgaard/ngx-tools";
import {ChipComponent} from "@juulsgaard/ngx-material";
import {
  MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import Fuse from "fuse.js";
import {arrToSet, isString} from "@juulsgaard/ts-tools";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'form-tag-list-input',
  standalone: true,
  imports: [
    CommonModule, ChipComponent, IconDirective, MatAutocompleteModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatTooltipModule, NoClickBubbleDirective, ChipComponent, NgxDragModule
  ],
  providers: [NgxDragService],
  animations: [harmonicaAnimation()],
  templateUrl: './tag-list-input.component.html',
  styleUrls: ['./tag-list-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListInputComponent extends BaseInputComponent<string[], string[]> {

  declare inputElement: Signal<HTMLInputElement|undefined>;

  readonly chips = viewChildren(ChipComponent);
  readonly canReorder: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly query = signal('');

  readonly floatLabel = computed(() => this.value.length ? 'always' : 'auto');

  private selectControl: Signal<SingleSelectNode<string, unknown> | MultiSelectNode<string, unknown> | undefined> = computed(
    () => {
      const control = this.control();
      if (!control || !isFormSelectNode(control)) return undefined;
      return control as SingleSelectNode<string, unknown> | MultiSelectNode<string, unknown>;
    }
  );

  private controlItems$ = toObservable(this.selectControl).pipe(
    switchMap(x => x?.items$.pipe(startWith(undefined)) ?? of(undefined))
  );
  private controlItems = toSignal(this.controlItems$);

  private mappedControlItems = computed(() => {
    const control = this.selectControl();
    if (!control) return undefined;
    const items = this.controlItems();
    if (!items) return undefined;
    return items.map(control.bindValue);
  });

  readonly itemsIn: InputSignal<string[] | undefined> = input<string[]|undefined>(undefined, {alias: 'items'});
  readonly items = computed(() => this.itemsIn() ?? this.mappedControlItems() ?? []);

  readonly options: Signal<Options>;

  constructor() {
    super();

    const query = throttleSignal(this.query, 500);
    const blacklist = computed(() => arrToSet(this.value));

    const searcher = new Fuse<string>([], {includeScore: true, isCaseSensitive: true});
    const filtered = computed(() => {
      const _blacklist = blacklist();
      const items = _blacklist.size ? this.items().filter(x => !_blacklist.has(x)) : this.items();
      searcher.setCollection(items);
      return items;
    });

    this.options = computed(() => {
      const _query = query();
      if (!_query.length) return {options: filtered()};

      const result = searcher.search(_query);
      const match = result.find(x => x.score === 0)?.item;
      const options = match
        ? result.filter(x => x.item !== match).map(x => x.item)
        : result.map(x => x.item);

      return {
        match,
        query: match ? undefined : _query,
        options
      }
    });
  }

  postprocessValue(value: string[]): string[] | undefined {
    return value.length < 1 ? undefined : value;
  }

  preprocessValue(value: string[] | undefined): string[] {
    return value ?? [];
  }

  removeTag(tag: string) {
    const index = this.value.findIndex(x => x === tag);
    if (index < 0) return;
    const list = [...this.value];
    list.splice(index, 1);
    this.value = list;

    const input = this.inputElement();
    if (input) {
      input.focus();
      input.selectionStart = 0;
      input.selectionEnd = 0;
    }
  }

  readonly trigger = viewChild(MatAutocompleteTrigger);
  onSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;

    if (value && isString(value)) {
      if (!this.value.includes(value)) {
        this.value = [...this.value, value];
      }
    }

    this.query.set('');
    const input = this.inputElement();
    if (input) input.value = '';
    setTimeout(() => this.trigger()?.openPanel(), 500);
  }

  onBackspace(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.selectionStart == null) return;
    if (input.selectionEnd == null) return;
    if (input.selectionStart !== input.selectionEnd) return;
    if (input.selectionStart > 0) return;

    const chip = this.chips().at(-1);
    if (!chip) return;
    chip.focusRemove();
  }

  getCanDrop(index: number) {
    return (context: NgxDragEvent<number>) => context.data !== index;
  }

  onDrop(event: NgxDragEvent<number>, index: number) {
    if (index === event.data) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const rightSide = event.clientX > rect.x + rect.width / 2;
    this.move(event.data, rightSide ? index + 1 : index);
  }

  private move(from: number, to: number) {
    if (to === from || to === from + 1) return;
    const list = [...this.value];

    if (to < from) {
      list.splice(to, 0, ...list.splice(from, 1));
    } else {
      list.splice(to - 1, 0, ...list.splice(from, 1));
    }

    this.value = list;
  }
}

interface Options {
  match?: string;
  query?: string;
  options: string[];
}
