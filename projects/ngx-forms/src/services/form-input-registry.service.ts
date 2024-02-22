import {InputTypes} from "@juulsgaard/ngx-forms-core";
import {Provider, Type} from "@angular/core";
import {BaseInputComponent} from "../lib/ngx-forms-tools";

export interface FormInputConfig {
  register(type: InputTypes, component: Type<BaseInputComponent<any, any>>): this;
}

class InternalFormInputConfig implements FormInputConfig {
  readonly map = new Map<InputTypes, Type<BaseInputComponent<any, any>>>;

  register(type: InputTypes, component: Type<BaseInputComponent<any, any>>): this {
    this.map.set(type, component);
    return this;
  }
}

export class FormInputRegistry {
  static Provide(builder: (cfg: FormInputConfig) => void): Provider {
    const config = new InternalFormInputConfig();
    builder(config);
    return {provide: FormInputRegistry, useValue: new FormInputRegistry(config.map)}
  }

  constructor(private map: Map<InputTypes, Type<BaseInputComponent<any, any>>>) {
  }

  getComponent(type: InputTypes) {
    return this.map.get(type);
  }
}
