import {inject, Injectable, InjectionToken, Provider, Type} from '@angular/core';
import {ObservableSet} from "@consensus-labs/rxjs-tools";
import {map} from "rxjs/operators";
import {auditTime, combineLatest, Observable, startWith} from "rxjs";

@Injectable({providedIn: 'root'})
export class AsideService {

  public static Provide(service?: Type<AsideService>): Provider {
    if (service) return {provide: AsideService, useClass: service};
    return {provide: AsideService};
  }

  public static ProvideConfig(config: AsideServiceConfig): Provider {
    return {provide: ASIDE_SERVICE_CONFIG, useValue: config};
  }

  private readonly sidebars$ = new ObservableSet<object>();
  private readonly config = inject(ASIDE_SERVICE_CONFIG, {optional: true});

  constructor() {
  }

  registerSidebar(directive: object): AsideStatus {
    this.sidebars$.toggle(directive, true);
    return new AsideStatus(this.sidebars$, directive, this.config ?? undefined);
  }

  unregisterSidebar(directive: object) {
    this.sidebars$.toggle(directive, false);
  }
}

interface AsideServiceConfig {
  maxDepth?: number;
  defaultBreakpoint?: number;
  defaultWidth?: number;
}

const ASIDE_SERVICE_CONFIG = new InjectionToken<AsideServiceConfig>('Config for Aside Service');

class AsideStatus {

  constructor(sidebars$: ObservableSet<object>, obj: object, config?: AsideServiceConfig) {

    const maxDepth = config?.maxDepth;
    const defaultBreakpoint = config?.defaultBreakpoint ?? 1350;
    const defaultWidth = config?.defaultWidth ?? 400;

    this.position$ = sidebars$.array$.pipe(
      map(x => x.findIndex(x => x === obj))
    );

    this.total$ = sidebars$.size$;

    this.depth$ = combineLatest([this.position$, this.total$]).pipe(
      auditTime(0),
      map(([pos, total]) => Math.max(0, total - pos - 1)),
      startWith(0),
    );

    this.breakpoint$ = this.depth$.pipe(
      map(depth => maxDepth && depth >= maxDepth ? Number.MAX_VALUE : defaultBreakpoint + (defaultWidth * depth))
    );
  }

  position$: Observable<number>;
  total$: Observable<number>;
  depth$: Observable<number>;
  breakpoint$: Observable<number>;
}
