import { FormGroup } from "@angular/forms";

export function validatTheEquality(matchWithKey: string, matchThisKey: string) {
    return (formGroup: FormGroup) => {
        const matchThisControl = formGroup.controls[matchThisKey];
        const matchWithControl = formGroup.controls[matchWithKey];
        if (!matchThisControl || !matchWithControl) {
            return null;
        }
        else if (matchThisControl.value === "" || matchWithControl.value === "") {
            return null;
        } else if (matchThisControl.errors && !matchThisControl.errors.misMatch) {
            return null;
        } else if (matchThisControl.value !== matchWithControl.value) {
            matchThisControl.setErrors({
                misMatch: true
            });
            // console.log(matchThisControl);
            return null;
        }
        matchThisControl.setErrors(null);
        return null;
    }
}