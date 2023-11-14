import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NgxAsyncAwaitDirective, NgxAsyncDirective, NgxIfDirective, NgxLetAwaitDirective, NgxLetDirective
} from "../../../directives";
import {BehaviorSubject, interval, timer} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'ngx-ngx-let-preview',
  standalone: true,
  imports: [
    CommonModule, NgxLetDirective, NgxLetAwaitDirective, NgxAsyncDirective, NgxAsyncAwaitDirective,
    NgxIfDirective
  ],
  templateUrl: './ngx-let-preview.component.html',
  styleUrls: ['./ngx-let-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxLetPreviewComponent {

  counter$ = new BehaviorSubject(0);
  count() {
    this.counter$.next(this.counter$.value + 1);
  }

  timer$ = interval(1000);

  delay$ = timer(5000);
  countedToTen$ = this.timer$.pipe(filter(x => x >= 10));

}
