import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, NgZone, signal
} from '@angular/core';
import {FormPage} from "@juulsgaard/ngx-forms-core";
import {SimpleObject} from "@juulsgaard/ts-tools";
import {FormContext} from "../../lib/ngx-forms-tools";
import {NgxTabContext} from "@juulsgaard/ngx-material";
import {filter, fromEvent, mergeWith, tap, throttleTime} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {FormErrorsComponent} from "../form-errors/form-errors.component";
import {FormErrorStateComponent} from "../form-error-state/form-error-state.component";
import {LoadingDirective} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'ngx-form-submit',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    FormErrorsComponent,
    FormErrorStateComponent,
    LoadingDirective
  ],
  templateUrl: './form-submit.component.html',
  styleUrl: './form-submit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSubmitComponent<T extends SimpleObject> {

  readonly form: InputSignal<FormPage<T>> = input.required<FormPage<T>>();
  readonly disableShortcut = input(false, {transform: booleanAttribute});

  private tabContext = inject(NgxTabContext, {optional: true});
  private formContext = inject(FormContext, {optional: true});

  readonly showErrors = signal(false);
  readonly readonly = computed(() => this.formContext?.readonly() === true);

  constructor() {
    const zone = inject(NgZone);

    zone.runOutsideAngular(() => {

      const shortcut$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
        filter(e => !e.repeat),
        filter(e => e.key === 's'),
        filter(e => e.metaKey || e.ctrlKey)
      );

      const saveEvents$ = fromEvent<KeyboardEvent>(window, 'save');

      shortcut$.pipe(
        mergeWith(saveEvents$),
        filter(() => !this.disableShortcut()),
        filter(() => this.tabContext?.isActive() != false),
        tap(e => e.preventDefault()),
        throttleTime(1000),
        takeUntilDestroyed()
      ).subscribe(() => zone.run(() => this.onSubmit()));
    });
  }

  onSubmit() {
    if (this.readonly()) return;
    this.form().submit();
  }

  onDelete() {
    if (this.readonly()) return;
    this.form().delete();
  }

}
