import {objToMap} from "@juulsgaard/ts-tools";

export function applyButtonClasses(element: HTMLElement) {
  const tagName = element.tagName.toLowerCase().replaceAll('-', '');

  for (let attr of [tagName, ...element.getAttributeNames()]) {
    const match = buttonClassLookup.get(attr.toLowerCase());
    if (!match) continue;
    element.classList.add(...match);
    break;
  }
}

const buttonClasses = {
  'ngxIconButton': ['ngx-icon-button'],
  'ngxRaisedIconButton': ['ngx-raised-icon-button', 'ngx-raised'],
  'ngxBorderedIconButton': ['ngx-bordered-icon-button', 'ngx-bordered'],
  'ngxFlatIconButton': ['ngx-flat-icon-button', 'ngx-flat'],
  'ngxButton': ['ngx-button', 'ngx-text-button'],
  'ngxRaisedButton': ['ngx-raised-button', 'ngx-raised', 'ngx-text-button'],
  'ngxBorderedButton': ['ngx-bordered-button', 'ngx-bordered', 'ngx-text-button'],
  'ngxFlatButton': ['ngx-flat-button', 'ngx-flat', 'ngx-text-button'],
}
const buttonClassLookup = objToMap(buttonClasses, (_, x) => x.toLowerCase());
