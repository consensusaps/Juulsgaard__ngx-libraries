import {Injectable} from '@angular/core';
import {SnackbarSiloService} from "./snackbar-silo.service";
import {InfoSnackbarComponent} from "../components/info-snackbar/info-snackbar.component";

@Injectable({providedIn: 'root'})
export class SnackbarService extends SnackbarSiloService {

    constructor() {
        super({
            cssClass: 'ngx-info-silo'
        });
    }

    success(message: string, title?: string) {
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 5000,
            data: {message, title: title},
            styles: ['ngx-success'],
            dismissable: true
        });
    }

    info(message: string, title?: string) {
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 5000,
            data: {message, title: title},
            styles: ['ngx-info'],
            dismissable: true
        });
    }

    warning(message: string, title?: string) {
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 5000,
            data: {message, title: title},
            styles: ['ngx-warning'],
            dismissable: true
        });
    }

    error(message: string, title?: string, data?: {[prop: string]: string|undefined}) {
        // TODO: Use Error component
        this.createSnackbar(InfoSnackbarComponent, {
            duration: 5000,
            data: {message, title: title, ...data},
            styles: ['ngx-error'],
            dismissable: true
        });
    }

}
