import {Injectable} from '@angular/core';
import {SnackbarSiloService} from "./snackbar-silo.service";
import {InfoSnackbarComponent} from "../components/info-snackbar/info-snackbar.component";

@Injectable({providedIn: 'root'})
export class SnackbarService extends SnackbarSiloService {

    constructor() {
        super({
            type: 'ngx-info-silo',
            maxElements: 2,
            order: 'default',
            showNewest: true
        });
    }

    success(message: string, title?: string) {
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 5000,
            data: {message, title: title},
            styles: ['ngx-success'],
            dismissable: true,
            swipeable: true,
            showTimer: true
        });
    }

    info(message: string, title?: string) {
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 5000,
            data: {message, title: title},
            styles: ['ngx-info'],
            dismissable: true,
            swipeable: true,
            showTimer: true
        });
    }

    warning(message: string, title?: string) {
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 8000,
            data: {message, title: title},
            styles: ['ngx-warning'],
            dismissable: true,
            swipeable: true,
            showTimer: true
        });
    }

    error(message: string, title?: string, data?: {[prop: string]: string|undefined}) {
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 12000,
            data: {message, title: title, data},
            styles: ['ngx-error'],
            dismissable: true,
            swipeable: true,
            showTimer: true
        });
    }

}
