import {
  ChangeDetectionStrategy, Component, forwardRef, Input, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";

@Component({
  selector: 'ngx-side-menu-tab',
  templateUrl: './side-menu-tab.component.html',
  styleUrls: ['./side-menu-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgxSideMenuTabContext, useExisting: forwardRef(() => SideMenuTabComponent)}]
})
export class SideMenuTabComponent extends NgxSideMenuTabContext {
  @Input({required: true}) id!: string;
  @Input() badge?: string;
  @Input() icon?: string;
  @Input() name?: string;

  constructor(readonly viewContainer: ViewContainerRef) {
    super();
  }

  @ViewChild('template', {static: true})
  readonly templateRef!: TemplateRef<void>;
}
