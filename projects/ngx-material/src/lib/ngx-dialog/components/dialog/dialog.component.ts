import {
  ChangeDetectionStrategy, Component, ContentChild, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {DialogFooterDirective} from "../../directives/dialog-footer.directive";
import {DialogManagerService} from "../../services/dialog-manager.service";
import {BaseDialogDirective} from "../../directives/base-dialog.directive";


@Component({
  selector: 'ngx-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent extends BaseDialogDirective {

  @ContentChild(DialogFooterDirective) set footerItem(item: DialogFooterDirective | undefined) {
    this.footer$.next(item ? this.footer : undefined);
  };

  @ViewChild('content', {static: true})
  content!: TemplateRef<void>;
  @ViewChild('footer', {static: true})
  footer!: TemplateRef<void>;

  override ngOnInit() {
    this.content$.next(this.content);
    super.ngOnInit();
  }


  constructor(viewContainer: ViewContainerRef, manager: DialogManagerService) {
    super(viewContainer, manager);
  }
}
