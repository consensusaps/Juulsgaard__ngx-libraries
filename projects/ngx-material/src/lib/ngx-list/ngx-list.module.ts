import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxListComponent} from './components/ngx-list/ngx-list.component';
import {NgxListItemComponent} from './components/ngx-list-item/ngx-list-item.component';
import {NgxListPrefixDirective} from "./directives/ngx-list-prefix.directive";
import {NgxListSuffixDirective} from "./directives/ngx-list-suffix.directive";


@NgModule({
  declarations: [
    NgxListComponent,
    NgxListItemComponent,
    NgxListPrefixDirective,
    NgxListSuffixDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxListComponent,
    NgxListItemComponent,
    NgxListPrefixDirective,
    NgxListSuffixDirective
  ]
})
export class NgxListModule { }
