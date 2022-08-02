import {Injectable} from "@angular/core";
import {Scheduler} from "@consensus-labs/rxjs-tools";
import {Popup, PopupButton} from "../models/popup.models";

@Injectable({ providedIn: 'root' })
export class PopupService {

    private scheduler = new Scheduler<Popup>();
    get popup$() {return this.scheduler.front$}

    constructor() {

    }

    public confirm(title: string, text: string, confirmText?: string, cancelText?: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.scheduler.push({
                text: text,
                title: title,
                buttons: [
                    {
                        text: cancelText ?? 'Cancel',
                        resolve: () => resolve(false)
                    },
                    {
                        text: confirmText ?? 'Confirm',
                        color: "primary",
                        resolve: () => resolve(true)
                    },
                ]
            });
        });
    }

    public plain(title: string, text: string, closeText?: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.scheduler.push({
                text: text,
                title: title,
                buttons: [
                    {
                        text: closeText ?? 'Close',
                        resolve: () => resolve(true)
                    },
                ]
            });
        });
    }

    public delete(title: string, text: string, deleteText?: string, cancelText?: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.scheduler.push({
                text: text,
                title: title,
                buttons: [
                    {
                        text: cancelText ?? 'Cancel',
                        resolve: () => resolve(false)
                    },
                    {
                        text: deleteText ?? 'Delete',
                        color: "warn",
                        resolve: () => resolve(true)
                    },
                ]
            });
        });
    }

    public clickButton(popup: Popup, button: PopupButton) {

        if (!this.scheduler.contains(popup)) return;

        if (button.loading) return;

        const res = button.resolve();

        if (res instanceof Promise) {
            button.loading = true;
            res.then(
                () => this.scheduler.removeItem(popup),
                () => button.loading = false,
            );
            return;
        }

        if (res !== false) {
            this.scheduler.removeItem(popup);
        }
    }
}
