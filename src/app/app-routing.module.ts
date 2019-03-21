import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { OrgRegisterComponent } from './org-register/org-register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthguardService } from './services/authguard.service';
import { ReverseAuthGuardService } from './services/reverse-auth-guard.service';

const routes: Routes = [
   { path: '', component: HomeComponent},
   { path: 'org-register', component: OrgRegisterComponent, canActivate: [AuthguardService]},
   { path: 'sign-up', component: SignupComponent, canActivate: [AuthguardService]},
   { path: 'log-in', component: LoginComponent, canActivate: [AuthguardService]},
   { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthguardService]},
   { path: 'dashboard', component: DashboardComponent}// , canActivate: [ReverseAuthGuardService] FIXME:
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
