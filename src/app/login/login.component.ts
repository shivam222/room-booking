import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormGroup, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { EmailValid } from './emailAsyncValidation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  myForm: FormGroup;
  constructor(private loginObj: LoginService, private emailValid: EmailValid, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], this.emailValid.emailValidator()],
      password: ['', [Validators.required]]
     });
  }

  logIn() {
    this.loginObj.login(this.myForm.value)
    .subscribe(res => {
      console.log(res);
    });
 }
}
