import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, EventEmitter, inject, input, InputSignal,
  InputSignalWithTransform, Output
} from '@angular/core';
import {UIScopeContext} from "@juulsgaard/ngx-material";
import {elementClassManager, IconDirective, LoadingDirective} from "@juulsgaard/ngx-tools";
import {MatRipple} from "@angular/material/core";
import {NgIf} from "@angular/common";
import {FormPage} from "@juulsgaard/ngx-forms-core";
import {MatButton} from "@angular/material/button";
import {FormErrorStateComponent} from "../form-error-state/form-error-state.component";

@Component({
  selector: 'ngx-form-header',
  standalone: true,
  imports: [
    IconDirective,
    MatRipple,
    NgIf,
    MatButton,
    FormErrorStateComponent,
    LoadingDirective
  ],
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.ngx-form-header]': 'true', '[class.ngx-header]': 'true'}
})
export class FormHeaderComponent {

  form: InputSignal<FormPage<any>> = input.required<FormPage<any>>();

  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() showErrors = new EventEmitter<void>();

  readonly heading: InputSignal<string | undefined> = input<string>();
  readonly subHeading: InputSignal<string | undefined> = input<string>();

  readonly hideClose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly hideBack: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  private uiContext = inject(UIScopeContext);

  constructor() {
    const header = this.uiContext.registerHeader();
    elementClassManager(computed(() => header().classes));
  }
}
