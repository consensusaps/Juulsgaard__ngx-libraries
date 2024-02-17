import {Directive} from '@angular/core';

@Directive({
  selector: '[ngxListSuffix]',
  host: {'[class.ngx-list-suffix]': 'true'}
})
export class NgxListSuffixDirective {

}
