import { Component } from '@angular/core';
import { CreateAccountService } from '../services/create-account.service';
import { FormGroup, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { OrgValid } from './orgAsyncValidation';
import { Router} from '@angular/router';

@Component({
  selector: 'app-org-register',
  templateUrl: './org-register.component.html',
  styleUrls: ['./org-register.component.css']
})
export class OrgRegisterComponent {
  myForm: FormGroup;
  resMessage: string;
  showLoader: boolean;
  resStatus: number;
  constructor(private createAcc: CreateAccountService, private orgValid: OrgValid, private fb: FormBuilder, private router: Router) {
   this.myForm = this.fb.group({
    org: ['', [Validators.required, Validators.minLength(2)], this.orgValid.orgValidator() ],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    cnfrmpass: ['', []]
   }, { validator: this.passMatch});
  }

  orgRegister() {
    this.showLoader = true;
    this.createAcc.orgRegister(this.myForm.value)
    .subscribe(res => {
      this.showLoader = false;
      this.resMessage = res.msg;
      this.resStatus = 200;
      this.router.navigateByUrl('/log-in');
    }, err => {
      this.showLoader = false;
      const body = JSON.parse(err._body);
      this.resMessage = body.msg;
      this.resStatus = err.status;
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
