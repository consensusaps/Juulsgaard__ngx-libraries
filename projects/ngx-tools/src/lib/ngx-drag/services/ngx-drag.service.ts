import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NgxDragService {

  drag?: unknown;

  constructor() {
  }

  register(data: unknown) {
    this.drag = data;
  }

  deregister(data: unknown) {
    if (this.drag === undefined) return;
    if (this.drag !== data) return;
    this.drag = undefined;
  }
}
