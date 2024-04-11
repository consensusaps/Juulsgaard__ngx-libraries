import {ErrorStateMatcher} from "@angular/material/core";
import {FormGroupDirective, NgForm, UntypedFormControl} from "@angular/forms";

export class TouchedErrorStateMatcher implements ErrorStateMatcher {

    isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control?.touched ?? false;
    }

}
export const touchedErrorStateMatcher = new TouchedErrorStateMatcher();

export class AlwaysErrorStateMatcher implements ErrorStateMatcher {

    isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
       return true;
    }

}
export const alwaysErrorStateMatcher = new AlwaysErrorStateMatcher();

export class NeverErrorStateMatcher implements ErrorStateMatcher {

    isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return false;
    }

}
export const neverErrorStateMatcher = new NeverErrorStateMatcher();
