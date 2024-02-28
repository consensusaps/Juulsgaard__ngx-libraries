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
  'ngxRaisedIconButton': ['ngx-raised-icon-button'],
  'ngxBorderedIconButton': ['ngx-bordered-icon-button'],
  'ngxFlatIconButton': ['ngx-flat-icon-button'],
  'ngxButton': ['ngx-button'],
  'ngxRaisedButton': ['ngx-raised-button'],
  'ngxBorderedButton': ['ngx-bordered-button'],
  'ngxFlatButton': ['ngx-flat-button'],
}
const buttonClassLookup = objToMap(buttonClasses, (_, x) => x.toLowerCase());
