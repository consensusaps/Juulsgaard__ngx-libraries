import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {NavAction} from "@pack/navigation/models/action";

@Component({
  selector: 'ngx-nav-menu-item',
  templateUrl: './nav-menu-item.component.html',
  styleUrls: ['./nav-menu-item.component.scss'],
  imports: [
    CommonModule,
    MatMenuModule,
    RouterLink,
    MatIconModule
  ],
  standalone: true
})
export class NavMenuItemComponent {
  @Input() action!: NavAction;
  @Output() run = new EventEmitter();
}

