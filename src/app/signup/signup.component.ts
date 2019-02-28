import { Component } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { UserStructure } from '../models/userStructure';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private signupObj: SignupService) { }

  signUp(newUserData: UserStructure) {
    this.signupObj.signup(newUserData)
    .subscribe(res => {
      console.log(res);
    });
}

}
