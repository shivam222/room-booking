import { Component } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { FormGroup, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { EmailValid } from './emailAsyncValidation';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  myForm: FormGroup;
  constructor(private signupObj: SignupService, private emailValid: EmailValid, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      org: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email], this.emailValid.emailValidator()],
      password: ['', [Validators.required, Validators.minLength(5)]],
      cnfrmpass: ['', []]
     }, { validator: this.passMatch});
  }

  signUp() {
    this.signupObj.signup(this.myForm.value)
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
