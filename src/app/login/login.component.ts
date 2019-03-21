import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormGroup, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { EmailValid } from './emailAsyncValidation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  myForm: FormGroup;
  constructor(private loginObj: LoginService, private emailValid: EmailValid, private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], this.emailValid.emailValidator()],
      password: ['', [Validators.required]]
     });
  }

  logIn() {
    this.showLoader = true;
    this.loginObj.login(this.myForm.value)
    .subscribe(res => {
      this.showLoader = false;
      this.resMessage = res.msg;
      this.resStatus = 200;
      this.router.navigateByUrl('/');
      localStorage.setItem('userEmail', res.email);
      localStorage.setItem('userRole', res.role);
      localStorage.setItem('userName', res.name);
      localStorage.setItem('userOrg', res.org);
      localStorage.setItem('token', res.token);
  }, err => {
      this.showLoader = false;
      const body = JSON.parse(err._body);
      this.resMessage = body.msg;
      this.resStatus = err.status;
  });
 }
}
