import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Self} from '@angular/core';
import {FormScopeService} from "../../services/form-scope.service";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
  providers: [FormScopeService],
  imports: [
    AsyncPipe,
    NgIf,
    NgTemplateOutlet,
    FormsModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormWrapperComponent {

  @Output() submit = new EventEmitter<void>();
  @Input() fieldset = false;

  @Input('readonly') set readonlyState(readonly: boolean) {
    this.scopeService.readonly$.next(readonly);
  }

  constructor(@Self() public scopeService: FormScopeService) { }
}
