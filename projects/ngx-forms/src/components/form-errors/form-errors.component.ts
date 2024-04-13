import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, input, InputSignalWithTransform, model,
  ModelSignal, Signal, signal
} from '@angular/core';
import {FormValidationContext, isFormNode} from "@juulsgaard/ngx-forms-core";
import {harmonicaInAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {isString} from "@juulsgaard/ts-tools";
import {ButtonComponent, IconButtonComponent} from "@juulsgaard/ngx-material";

@Component({
  selector: 'ngx-form-errors',
  standalone: true,
  imports: [
    NgIf,
    IconDirective,
    ButtonComponent,
    IconButtonComponent
  ],
  templateUrl: './form-errors.component.html',
  styleUrl: './form-errors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [harmonicaInAnimation()]
})
export class FormErrorsComponent {

  show: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  showAllIn: ModelSignal<boolean | undefined> = model<boolean | undefined>(undefined, {alias: 'showAll'});
  private _showAll = signal(false);
  showAll: Signal<boolean> = computed(() => this.showAllIn() || this._showAll());

  errors: InputSignalWithTransform<
    FormValidationContext[] | string[],
    FormValidationContext[] | string[] | undefined
  > = input([], {
    transform: (errors: FormValidationContext[] | string[] | undefined) => {
      if (!errors?.length) return [];
      return errors;
    }
  });

  warnings: InputSignalWithTransform<
    FormValidationContext[] | string[],
    FormValidationContext[] | string[] | undefined
  > = input([], {
    transform: (warnings: FormValidationContext[] | string[] | undefined) => {
      if (!warnings?.length) return [];
      return warnings;
    }
  });

  list = computed(() => [
    ...this.errors().map(data => formatData(data, 'error')),
    ...this.warnings().map(data => formatData(data, 'warning'))
  ]);

  hasMore = computed(() => this.list().length > 1);

  first = computed(() => this.list().at(0));
  rest = computed(() => this.list().slice(1));

  constructor() {
    effect(() => {
      if (this.show()) return;
      this._showAll.set(false)
    }, {allowSignalWrites: true});
  }

  toggle() {
    const showAll = this.showAll();
    this._showAll.set(!showAll);
    if (this.showAllIn() != null) this.showAllIn.set(!showAll);
  }

}

interface Data {
  type: 'warning' | 'error';
  message: string;
  icon?: string;
  scrollTo?: () => void;
  context?: FormValidationContext;
}

function formatData(data: FormValidationContext | string, type: 'warning' | 'error'): Data {
  if (isString(data)) return {type, message: data};

  const unit = data.data.unit;

  if (isFormNode(unit)) {
    return {
      type,
      message: data.data.message,
      context: data,
      icon: 'edit',
      scrollTo: () => unit.focus({scroll: true})
    };
  }

  return {
    type,
    message: data.data.message,
    context: data
  };
}
