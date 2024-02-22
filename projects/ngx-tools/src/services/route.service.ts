import {DestroyRef, inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {RouteState} from "../helpers/route-state";

@Injectable({providedIn: 'root'})
export class RouteService extends RouteState {

  private router = inject(Router, {optional: true});
  get route() {return this.router?.routerState.root}
  get routeOrClosest() {return this.route}

  constructor() {
    super();
    const router = inject(Router, {optional: true});
    if (!router) return;
    this.init(router, inject(DestroyRef));
  }
}
