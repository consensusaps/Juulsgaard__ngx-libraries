import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {IconDirective, ImageFallbackDirective, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {WithId} from "@consensus-labs/ts-tools";
import {MatMenuModule, MatMenuPanel} from "@angular/material/menu";
import {ListFlag} from "@consensus-labs/data-sources";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NavAction} from "../../../models/action";

@Component({
  selector: 'ngx-nav-list-item',
  standalone: true,
  imports: [
    CommonModule, ImageFallbackDirective, MatIconModule, MatRippleModule, NoClickBubbleDirective, IconDirective,
    MatMenuModule, MatTooltipModule, MatCheckboxModule
  ],
  templateUrl: './nav-list-item.component.html',
  styleUrls: ['./nav-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.list-item]': 'true', '[class.active]': 'item?.id === activeId'}
})
export class NavListItemComponent<T extends WithId> {

  @Input() item?: T;
  @Input({required: true}) header!: string;
  @Input() subText?: string;
  @Input() icon?: string;
  @Input() avatar?: string;
  @Input() avatarFallback?: string;

  @Input() context?: MatMenuPanel;
  @Input() actions?: NavAction[];
  @Input() flags?: ListFlag[];
  @Input() activeId?: string;

  @Input() selected = false;
  @Input() checkbox?: 'square'|'round';

}
