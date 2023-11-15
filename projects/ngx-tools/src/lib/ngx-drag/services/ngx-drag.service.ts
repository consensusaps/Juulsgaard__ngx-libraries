import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NgxDragService {

  drag?: unknown;
  effect?: 'move'|'link'|'copy';

  constructor() {
  }

  register(data: unknown, dropEffect: "move" | "link" | "copy" | undefined) {
    this.drag = data;
    this.effect = dropEffect;
  }

  deregister(data: unknown) {
    if (this.drag === undefined) return;
    if (this.drag !== data) return;
    this.drag = undefined;
    this.effect = undefined;
  }
}
