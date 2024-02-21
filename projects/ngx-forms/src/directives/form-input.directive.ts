import {
  booleanAttribute, ComponentRef, computed, Directive, effect, inject, input, ViewContainerRef
} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {ControlContainer} from "@angular/forms";
import {AnonFormNode, isFormNode} from "@juulsgaard/ngx-forms-core";
import {FormInputRegistry} from "../services";
import {BaseInputComponent} from "../lib/ngx-forms-tools";

@Directive({
  selector: 'form-input',
  standalone: true,
  host: {'[style.display]': '"none"'}
})
export class FormInputDirective {

  /** The input label */
  readonly label = input<string>();

  /** A placeholder text, if not set the label will be used */
  readonly placeholder = input<string>();

  /** Input to tell the browser what type of autocomplete the input should use */
  readonly autocomplete = input<string>();

  /** Focus the input when it's first created */
  readonly autofocus = input(false, {transform: booleanAttribute});

  /** Add a tooltip with additional information about the input */
  readonly tooltip = input<string>();

  /** Set the theme color for the input */
  readonly color = input<ThemePalette>('primary');

  /** Change the material input style */
  readonly appearance = input<MatFormFieldAppearance>('outline');

  /** Hide the required asterisk */
  readonly direction = input<'ltr' | 'rtl' | 'auto'>();

  readonly disabled = input(false, {transform: booleanAttribute});
  readonly readonly = input(false, {transform: booleanAttribute});

  private getContext(): Context {
    return {
      control: this.control(),
      label: this.label(),
      placeholder: this.placeholder(),
      autocomplete: this.autocomplete(),
      autofocus: this.autofocus(),
      tooltip: this.tooltip(),
      color: this.color(),
      appearance: this.appearance(),
      direction: this.direction(),
      readonly: this.readonly(),
      disabled: this.disabled()
    }
  }

  private controlContainer = inject(ControlContainer, {optional: true, host: true, skipSelf: true});

  readonly controlIn = input<AnonFormNode | undefined>(undefined, {alias: 'control'});
  readonly controlName = input<string>();
  private namedControl = computed(() => {
    if (!this.controlContainer) return undefined;
    const name = this.controlName();
    if (!name) return undefined;
    const control = this.controlContainer.control?.get(name);
    if (isFormNode(control)) return control as AnonFormNode;
    return undefined;
  })

  private control = computed(() => this.controlIn() ?? this.namedControl());

  private registry = inject(FormInputRegistry);
  private viewContainer = inject(ViewContainerRef);
  private component?: ComponentRef<BaseInputComponent<unknown, unknown>>;

  constructor() {
    const componentType = computed(() => {
      const control = this.control();
      if (!control) return undefined;
      return this.registry.getComponent(control.type);
    });

    effect(() => {
      const _componentType = componentType();
      if (!_componentType) {
        this.component?.destroy();
        this.component = undefined;
        return;
      }

      const context = this.getContext();

      queueMicrotask(() => {
        if (!this.component) {
          this.component = this.viewContainer.createComponent(_componentType);

        } else if (this.component.componentType !== _componentType) {
          this.component.destroy();
          this.component = this.viewContainer.createComponent(_componentType);
        }

        this.applyContext(context);
      });
    });
  }

  private applyContext(context: Context) {
    const component = this.component;
    if (!component) return;

    component.setInput('control', context.control);
    component.setInput('appearance', context.appearance);
    component.setInput('color', context.color);
    component.setInput('readonly', context.readonly);
    component.setInput('autocomplete', context.autocomplete);
    component.setInput('tooltip', context.tooltip);
    component.setInput('disabled', context.disabled);
    component.setInput('label', context.label);
    component.setInput('placeholder', context.placeholder);
    component.setInput('autofocus', context.autofocus);
    component.setInput('direction', context.direction);
  }
}

interface Context {
  control: AnonFormNode|undefined,
  appearance: "fill" | "outline";
  color: "primary" | "accent" | "warn" | undefined;
  readonly: boolean;
  autocomplete: string | undefined;
  tooltip: string | undefined;
  disabled: boolean;
  label: string | undefined;
  placeholder: string | undefined;
  autofocus: boolean;
  direction: "ltr" | "rtl" | "auto" | undefined
}
