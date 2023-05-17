import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'cms-nav-tree-actions',
  templateUrl: './nav-tree-actions.component.html',
  styleUrls: ['./nav-tree-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// TODO: Rewrite to OnPush
export class NavTreeActionsComponent {

  @Input() showCut = false;
  @Input() showPaste = false;
  @Input() showClearClipboard = false;
  @Input() showClearSelection = false;

  @Output() cut = new EventEmitter<void>();
  @Output() paste = new EventEmitter<void>();
  @Output() clearClipboard = new EventEmitter<void>();
  @Output() clearSelection = new EventEmitter<void>();

  constructor() { }

  onClear() {
    if (this.showClearClipboard) {
      this.clearClipboard.emit();
    }

    this.clearSelection.emit();
  }
}
