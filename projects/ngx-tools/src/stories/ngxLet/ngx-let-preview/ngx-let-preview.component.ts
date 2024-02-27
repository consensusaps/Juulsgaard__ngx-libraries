import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NgxAsyncAwaitDirective, NgxAsyncDirective, NgxIfDirective, NgxIfNotDirective, NgxLetDirective
} from "../../../directives";
import {BehaviorSubject, interval, startWith, timer} from "rxjs";
import {filter, map} from "rxjs/operators";
import {cache} from "@juulsgaard/rxjs-tools";

@Component({
  selector: 'ngx-ngx-let-preview',
  standalone: true,
  imports: [
    CommonModule, NgxLetDirective, NgxAsyncDirective, NgxAsyncAwaitDirective,
    NgxIfDirective, NgxIfNotDirective
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

  timer$ = interval(1000).pipe(startWith(-1), cache());

  delay$ = timer(5000);
  aboveTen$ = this.timer$.pipe(filter(x => x >= 10));
  countedToTen$ = this.timer$.pipe(map(x => x >= 10));

}
