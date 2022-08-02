import {ThemePalette} from "@angular/material/core";

export interface Popup {
    text: string;
    title?: string;
    buttons: PopupButton[];
}

export interface PopupButton {
    text: string;
    color?: ThemePalette;
    resolve: () => Promise<boolean>|boolean|void;
    loading?: boolean;
}
