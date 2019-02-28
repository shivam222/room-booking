import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { OrgRegisterComponent } from './org-register/org-register.component';

const routes: Routes = [
   { path: '', component: HomeComponent},
   { path: 'org-register', component: OrgRegisterComponent},
   { path: 'sign-up', component: SignupComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
