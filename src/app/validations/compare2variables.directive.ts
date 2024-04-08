import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS } from '@angular/forms';
import { validatTheEquality } from './compare2variables-validator';

@Directive({
  selector: '[appCompare2variables]',
  providers: [{ provide: NG_VALIDATORS, useExisting: Compare2variablesDirective, multi: true }]
})
export class Compare2variablesDirective {

  @Input('appCompare2variables')
  matchContolKeys: string[];

  constructor() {
    this.matchContolKeys = [];
  }

  public validate(formGroup: FormGroup) {
    return validatTheEquality(this.matchContolKeys[0], this.matchContolKeys[1])(formGroup);
  }

}
