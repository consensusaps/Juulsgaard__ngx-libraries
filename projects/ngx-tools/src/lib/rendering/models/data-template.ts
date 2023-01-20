import {EmbeddedViewRef, Injector, TemplateRef, ViewContainerRef} from "@angular/core";
import {Observable, take} from "rxjs";

export type AnyTemplate<T = any> = T extends void ? DataTemplate<T>|TemplateRef<void> : DataTemplate<T>;
export abstract class DataTemplate<T> {

  protected constructor(public readonly template: TemplateRef<T>) {
  }

  abstract getData(): T;

  render(container: ViewContainerRef, injector?: Injector): EmbeddedViewRef<T> {
    return container.createEmbeddedView(this.template, this.getData(), {injector: injector});
  }
}

export class StaticTemplate extends DataTemplate<void> {

  constructor(template: TemplateRef<void>) {
    super(template)
  }

  getData(): void {
    return undefined;
  }
}

export class CallbackDataTemplate<T> extends DataTemplate<T> {

  protected constructor(
    template: TemplateRef<T>,
    private _getData: () => T
  ) {
    super(template);
  }

  override getData(): T {
    return this._getData();
  }
}

export class ObservableDataTemplate<T> extends DataTemplate<T> {

  protected constructor(
    template: TemplateRef<T>,
    private data$: Observable<T>
  ) {
    super(template);
  }

  override getData(): T {
    let data: T;
    let hasData = false;
    const sub = this.data$.pipe(take(1)).subscribe(val => {
      hasData = true;
      data = val;
    });
    sub.unsubscribe();
    if (!hasData) throw Error('The observable is empty');
    return data!;
  }
}

/** Coalesce any Template into a Data Template */
export function coalesceTemplate<T>(template: DataTemplate<T>): DataTemplate<T>;
/** Coalesce any Template into a Data Template */
export function coalesceTemplate(template: TemplateRef<void>): StaticTemplate;
/** Coalesce any Template into a Data Template */
export function coalesceTemplate<T>(template: AnyTemplate<T>): DataTemplate<T>;
export function coalesceTemplate<T>(template: AnyTemplate<T>): DataTemplate<T> {
  if (template instanceof DataTemplate) return template;
  return new StaticTemplate(template) as DataTemplate<T>;
}
