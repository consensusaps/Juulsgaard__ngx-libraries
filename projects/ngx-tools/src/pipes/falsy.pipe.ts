import {Pipe} from '@angular/core';
import {TruthyPipe} from "./truthy.pipe";

@Pipe({
  name: 'falsy',
  pure: false,
  standalone: true
})
export class FalsyPipe extends TruthyPipe {

  protected override parseValue(x: any): boolean {
    return !x;
  }
}
