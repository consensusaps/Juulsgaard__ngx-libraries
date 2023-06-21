import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, NgZone, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BaseInputComponent} from '@consensus-labs/ngx-forms';
import {fromEvent} from "rxjs";
import {filter} from "rxjs/operators";
import {IconDirective, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {MatRippleModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {IconButtonComponent} from "@consensus-labs/ngx-material";


@Component({
  selector: 'form-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NoClickBubbleDirective,
    FormsModule,
    MatRippleModule,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatButtonModule,
    IconButtonComponent
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

  constructor(zone: NgZone) {
    super();

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
