import {inject, Injectable} from "@angular/core";
import {BaseIconService} from "./icon-base.service";
import {baseIconAliases, BaseIconAliases} from "../models/icon-aliases";
import {ICON_PROVIDER} from "./icon-provider.service";

@Injectable({providedIn: 'root'})
export class IconService extends BaseIconService<BaseIconAliases> {

  provider = inject(ICON_PROVIDER);

  constructor() {
    super();
    this.addAliases(baseIconAliases);
  }
}
