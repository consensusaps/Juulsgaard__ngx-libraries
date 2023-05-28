import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'ngx-theme-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-preview.component.html',
  styleUrls: ['./theme-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemePreviewComponent {
  names = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  @HostBinding('class.light')
  @Input() light?: boolean;

  @HostBinding('class.dark')
  @Input() dark?: boolean;
}
