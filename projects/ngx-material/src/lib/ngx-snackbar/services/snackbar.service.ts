import {Injectable} from '@angular/core';
import {ErrorSnackComponent} from "../components/error-snack/error-snack.component";
import {PlainSnackComponent} from "../components/plain-snack/plain-snack.component";
import {MatLegacySnackBar} from "@angular/material/legacy-snack-bar";

@Injectable()
export class SnackbarService {

    constructor(private snackBar: MatLegacySnackBar) {
    }

    success(message: string, title?: string) {
        this.snackBar.openFromComponent(PlainSnackComponent, {
            duration: 5000,
            data: {message, title: title},
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            panelClass: 'success'
        });
    }

    info(message: string, title?: string) {
        this.snackBar.openFromComponent(PlainSnackComponent, {
            duration: 5000,
            data: {message, title: title},
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            panelClass: 'info'
        });
    }

    warning(message: string, title?: string) {
        this.snackBar.openFromComponent(PlainSnackComponent, {
            duration: 5000,
            data: {message, title: title},
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            panelClass: 'warning'
        });
    }

    error(message: string, title?: string, data?: {[prop: string]: string|undefined}) {
        this.snackBar.openFromComponent(ErrorSnackComponent, {
            duration: 10000,
            data: {message, title: title, ...data},
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            panelClass: 'error'
        });
    }

}
