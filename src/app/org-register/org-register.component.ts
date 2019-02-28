import { Component } from '@angular/core';
import { CreateAccountService } from '../services/create-account.service';
import { UserStructure } from '../models/userStructure';

@Component({
  selector: 'app-org-register',
  templateUrl: './org-register.component.html',
  styleUrls: ['./org-register.component.css']
})
export class OrgRegisterComponent {

  constructor(private createAcc: CreateAccountService) { }

  orgRegister(newUserData: UserStructure) {
      this.createAcc.orgRegister(newUserData)
      .subscribe(res => {
        console.log(res);
      });
  }
}
