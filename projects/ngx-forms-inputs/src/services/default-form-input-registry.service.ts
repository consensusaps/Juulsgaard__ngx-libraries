import {Provider} from "@angular/core";
import {FormInputConfig, FormInputRegistry} from "@juulsgaard/ngx-forms";
import {InputTypes} from "@juulsgaard/ngx-forms-core";
import {
  BoolInputComponent, ColorInputComponent, DateInputComponent, DateTimeInputComponent, FileInputComponent,
  LongTextInputComponent, MatSelectMultipleInputComponent, NumberInputComponent, PasswordInputComponent,
  TextInputComponent, TimeInputComponent
} from "../inputs";
import {MatSelectInputComponent} from "../inputs/mat-select-input/mat-select-input.component";

export class DefaultFormInputRegistryService {
  static Provide(builder?: (cfg: FormInputConfig) => void): Provider {
    return FormInputRegistry.Provide(cfg => {

      cfg.register(InputTypes.Text, TextInputComponent);
      cfg.register(InputTypes.Email, TextInputComponent);
      cfg.register(InputTypes.Phone, TextInputComponent);
      cfg.register(InputTypes.Url, TextInputComponent);

      cfg.register(InputTypes.LongText, LongTextInputComponent);
      cfg.register(InputTypes.Password, PasswordInputComponent);
      cfg.register(InputTypes.Color, ColorInputComponent);

      cfg.register(InputTypes.Bool, BoolInputComponent);

      cfg.register(InputTypes.File, FileInputComponent);

      cfg.register(InputTypes.Number, NumberInputComponent);

      cfg.register(InputTypes.Date, DateInputComponent);
      cfg.register(InputTypes.Time, TimeInputComponent);
      cfg.register(InputTypes.DateTime, DateTimeInputComponent);

      cfg.register(InputTypes.Select, MatSelectInputComponent);
      cfg.register(InputTypes.SelectMany, MatSelectMultipleInputComponent);

      builder?.(cfg);
    });
  }
}
