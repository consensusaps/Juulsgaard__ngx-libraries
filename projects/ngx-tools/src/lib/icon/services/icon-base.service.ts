import {inject, Injectable} from "@angular/core";
import {AliasTranslation} from "../models/icon-aliases";
import {ICON_PROVIDER} from "./icon-provider.service";
import {IconConfig, IconData} from "../models/icon-models";
import {IconProviders} from "../models/icon-providers";

@Injectable()
export abstract class BaseIconService<TAliases extends string> {

  private readonly aliasMap = new Map<string, AliasTranslation>();
  public readonly defaultProvider = inject(ICON_PROVIDER);

  protected addAlias(alias: string, translation: AliasTranslation) {
    this.aliasMap.set(alias, translation);
  }

  protected addAliases<T extends {[key: string]: AliasTranslation}>(aliases: T) {
    for (let alias in aliases) {
      this.addAlias(alias, aliases[alias]!);
    }
  }

  public parseAlias(alias: TAliases|string, provider?: IconProviders): IconData|undefined {
    if (!alias) return undefined;
    const translation = this.aliasMap.get(alias);
    if (!translation) return undefined;

    provider = provider ?? this.defaultProvider;
    const result = translation[provider];

    return this.parseIcon(result, provider);
  }

  public parseIcon(icon: string|IconConfig, provider?: IconProviders): IconData|undefined {
    if (!icon) return undefined;
    provider = provider ?? this.defaultProvider;

    const config = typeof icon === 'string' ? {icon: icon} : icon;

    switch (provider) {
      case "mat":
        return {providerClass: 'material-icons', text: config.icon, scale: config.scale};
      case "fa":
        return {providerClass: 'font-awesome', classes: config.icon.split(/\s+/), scale: config.scale};
    }

    return undefined;
  }
}
