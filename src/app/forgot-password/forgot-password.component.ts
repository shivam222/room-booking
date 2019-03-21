import { Component } from '@angular/core';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { FormGroup, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { EmailValid } from './emailAsyncValidation';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  myForm: FormGroup;
  showLoader: boolean;
  resMessage: string;
  resStatus: number;
  constructor(private forgotService: ForgotPasswordService, private emailValid: EmailValid, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], this.emailValid.emailValidator()],
      password: ['', [Validators.required, Validators.minLength(5)]],
      cnfrmpass: ['', []]
     }, { validator: this.passMatch});
  }

  forgotpass() {
    this.showLoader = true;
    this.forgotService.forgotPass(this.myForm.value)
    .subscribe(res => {
      this.showLoader = false;
      this.resMessage = res.msg;
      this.resStatus = 200;
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
