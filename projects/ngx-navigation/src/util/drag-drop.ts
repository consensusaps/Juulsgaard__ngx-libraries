import {WithId} from "@consensus-labs/ts-tools";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {MoveModel} from "../models/move";
import {ISorted} from "../models/sorted";

export function applyCdkDrag<T extends Partial<ISorted> & WithId>(
  list: T[],
  event: CdkDragDrop<unknown, unknown, string>
): MoveModel | undefined {


  if (list.length < 1) return;
  if (event.currentIndex >= list.length) return;

  const itemId = event.item.data;
  const item = list.find(x => x.id === itemId);
  if (!item) return;

  const index = item.index;
  if (index === undefined) return;

  let newIndex = list[event.currentIndex]!.index;

  if (newIndex === undefined) return;
  if (index < newIndex) newIndex++;
  if (index === newIndex) return;

  return {id: itemId, index: newIndex};
}
