import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(size: number): string {
    const kb = size / 1000;
    if (kb < 1000) return `${kb.toFixed(2)}KB`;
    const mb = kb / 1000;
    if (mb < 1000) return `${mb.toFixed(2)}MB`;
    const gb = mb / 1000;
    if (gb < 1000) return `${gb.toFixed(2)}GB`;
    return 'Too big';
  }

}
