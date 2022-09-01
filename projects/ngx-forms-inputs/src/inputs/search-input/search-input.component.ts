import {Component, EventEmitter, Host, HostListener, Input, NgZone, Optional, Output, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from '@angular/forms';
import { BaseInputComponent, FormScopeService } from '@consensus-labs/ngx-forms';
import {fromEvent} from "rxjs";
import {filter} from "rxjs/operators";
import {MatInputModule} from "@angular/material/input";
import {NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {MatRippleModule} from "@angular/material/core";


@Component({
  selector: 'form-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  imports: [
    MatInputModule,
    NoClickBubbleDirective,
    FormsModule,
    MatRippleModule
  ],
  standalone: true
})
export class SearchInputComponent extends BaseInputComponent<string|undefined, string> {

  @HostListener('keydown.enter', ['$event'])
  onEnter() {
    if (!this.submit.observed) return;
    this.submit.emit(this.externalValue);
  }

  @HostListener('keydown.escape', ['$event'])
  escape(event: KeyboardEvent) {
    event.stopPropagation();
    this.control.reset('');
    this.inputElement?.nativeElement?.blur();
  }

  @Input() globalFocus = false;

  @Output() submit = new EventEmitter<string>();

  constructor(zone: NgZone, @Optional() @Host() @SkipSelf() controlContainer?: ControlContainer, @Optional() formScope?: FormScopeService) {
    super(controlContainer, formScope);

    // Listen to key input that isn't in an input
    zone.runOutsideAngular(() => {
      this.subscriptions.add(fromEvent<KeyboardEvent>(window, 'keydown').pipe(
        filter(() => this.globalFocus),
        filter(e => !e.altKey && !e.ctrlKey && !e.metaKey),
        filter(e => e.key.length === 1 && /\w/.test(e.key)),
        filter(() => document.activeElement?.tagName !== 'INPUT'
          && document.activeElement?.tagName !== 'TEXTAREA'
          && !document.activeElement?.hasAttribute('contenteditable')),

      ).subscribe(e => zone.run(() => {
        this.focus();
        this.control.patchValue((this.control.value ?? '') + e.key);
      })));
    })
  }

  postprocessValue(value: string|undefined) {
    return value ? value : undefined;
  }

  preprocessValue(value: string|undefined): string {
    return value ?? '';
  }
}
