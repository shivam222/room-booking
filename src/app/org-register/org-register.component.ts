import { Component } from '@angular/core';
import { CreateAccountService } from '../services/create-account.service';
import { FormGroup, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { OrgValid } from './orgAsyncValidation';

@Component({
  selector: 'app-org-register',
  templateUrl: './org-register.component.html',
  styleUrls: ['./org-register.component.css']
})
export class OrgRegisterComponent {
  myForm: FormGroup;
  constructor(private createAcc: CreateAccountService, private orgValid: OrgValid, private fb: FormBuilder) {
   this.myForm = this.fb.group({
    org: ['', [Validators.required, Validators.minLength(2)], this.orgValid.orgValidator() ],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    cnfrmpass: ['', []]
   }, { validator: this.passMatch});
  }

  orgRegister() {
    this.createAcc.orgRegister(this.myForm.value)
    .subscribe(res => {
            console.log(res);
    });
  }

   passMatch (fg: FormGroup) {
    const pass = fg.get('password').value;
    const cnfrmpass = fg.get('cnfrmpass').value;
    if (pass !== cnfrmpass) {
    fg.get('cnfrmpass').setErrors({matchErr: true});
    }
    return null;
   }
 }
