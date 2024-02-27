import {Injectable, Signal} from "@angular/core";
import {NgxTabContext} from "./ngx-tab.context";

@Injectable()
export abstract class NgxTabBarContext {
  abstract slug: Signal<string|undefined>;
  abstract active: Signal<boolean>;
  abstract tab: Signal<NgxTabContext|undefined>;
  abstract tabs: Signal<NgxTabContext[]>;
  abstract openTab(slug: string): Promise<void>;
}
