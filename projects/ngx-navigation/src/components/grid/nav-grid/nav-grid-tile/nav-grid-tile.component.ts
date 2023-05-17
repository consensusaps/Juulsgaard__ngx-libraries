import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {GridData} from "@consensus-labs/data-sources";
import {WithId} from "@consensus-labs/ts-tools";
import {CommonModule} from "@angular/common";
import {MatRippleModule} from "@angular/material/core";
import {ContextMenuDirective} from "@consensus-labs/ngx-material";
import {MatIconModule} from "@angular/material/icon";
import {ImageFallbackDirective, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NavMenuItemComponent} from "../../../shared/nav-menu-item/nav-menu-item.component";

@Component({
  selector: 'ngx-nav-grid-tile',
  templateUrl: './nav-grid-tile.component.html',
  styleUrls: ['./nav-grid-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatRippleModule,
    ContextMenuDirective,
    ImageFallbackDirective,
    MatIconModule,
    MatTooltipModule,
    NoClickBubbleDirective,
    MatMenuModule,
    NavMenuItemComponent
  ]
})
export class NavGridTileComponent<TItem extends WithId> {

  @Input() data!: GridData<TItem>;
  @Input() noRipple = false;
  @Input() imageFallback?: string
  @HostBinding('class.active')
  @Input() active = false;

  constructor() { }

}
