import {Inject, Injectable} from "@angular/core";
import {BaseIconService} from "./icon-base.service";
import {baseIconAliases, BaseIconAliases} from "../models/icon-aliases";
import {ICON_PROVIDER} from "./icon-provider.service";
import {IconProviders} from "../models/icon-providers";

@Injectable({providedIn: 'root'})
export class IconService extends BaseIconService<BaseIconAliases> {

  constructor(@Inject(ICON_PROVIDER) provider: IconProviders) {
    super();
    this.addAliases(baseIconAliases);
  }
}
