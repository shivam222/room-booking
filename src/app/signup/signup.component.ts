import { Component } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { FormGroup, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { EmailValid } from './emailAsyncValidation';
import { Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  myForm: FormGroup;
  constructor(private signupObj: SignupService, private emailValid: EmailValid, private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      org: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email], this.emailValid.emailValidator()],
      password: ['', [Validators.required, Validators.minLength(5)]],
      cnfrmpass: ['', []]
     }, { validator: this.passMatch});
  }

  signUp() {
    this.showLoader = true;
    this.signupObj.signup(this.myForm.value)
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
