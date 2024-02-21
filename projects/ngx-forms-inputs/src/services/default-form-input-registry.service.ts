import {Provider} from "@angular/core";
import {FormInputConfig, FormInputRegistry} from "@juulsgaard/ngx-forms";
import {InputTypes} from "@juulsgaard/ngx-forms-core";
import {
  BoolInputComponent, ColorInputComponent, DateInputComponent, DateTimeInputComponent, LongTextInputComponent,
  MatSelectInputComponent, NumberInputComponent, PasswordInputComponent, TextInputComponent, TimeInputComponent
} from "../inputs";

export class DefaultFormInputRegistryService {
  static Provide(builder?: (cfg: FormInputConfig) => void): Provider {
    return FormInputRegistry.Provide(cfg => {

      cfg.register(InputTypes.Text, TextInputComponent);
      cfg.register(InputTypes.LongText, LongTextInputComponent);
      cfg.register(InputTypes.Password, PasswordInputComponent);
      cfg.register(InputTypes.Color, ColorInputComponent);

      cfg.register(InputTypes.Bool, BoolInputComponent);

      cfg.register(InputTypes.Number, NumberInputComponent);

      cfg.register(InputTypes.Date, DateInputComponent);
      cfg.register(InputTypes.Time, TimeInputComponent);
      cfg.register(InputTypes.DateTime, DateTimeInputComponent);

      cfg.register(InputTypes.Select, MatSelectInputComponent);
      cfg.register(InputTypes.SelectMany, MatSelectInputComponent);

      builder?.(cfg);
    });
  }
}
