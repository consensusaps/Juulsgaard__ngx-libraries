import {DestroyRef, inject, Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {RouteState} from "../helpers/route-state";

@Injectable({providedIn: 'root'})
export class RouteService extends RouteState {

  private router = inject(Router);
  get routeOrDefault(): ActivatedRoute {return this.routeOrClosest}
  get routeOrClosest() {return this.router.routerState.root}

  constructor() {
    super();
    const router = inject(Router, {optional: true});
    if (!router) return;
    this.init(router, inject(DestroyRef));
  }

  prepopulate(route: ActivatedRouteSnapshot) {
    this.emitSnapshots(route.root, route.root);
  }
}
